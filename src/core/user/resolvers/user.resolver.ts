import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { prisma, redis } from 'server';
import {
    previewUrl,
    sendEmailChangeConfirmationMail,
} from 'common/utils/mail.util';
import { compare, hash } from 'common/utils/password.util';
import { randomUUID } from 'crypto';

import { ValidateSchemas } from 'common/decorators/validation';
import { ICustomContext } from 'common/types/custom-context.interface';
import { User } from '../schemas/user.schema';
import { UserService } from '../services/user.service';
import { UpdateUserInput } from '../inputs/update-user.schema';
import { GqlHttpException, HttpStatus } from '../../../common/errors/errors';
import { Gender } from '../enums/gender.enum';
import { CreateUserInput } from '../inputs/create-user.schema';

@Resolver(() => User)
export class UserResolver {
    userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    @Query(() => [User])
    users(@Arg('email') email: string) {
        return prisma.user.findMany({ where: { email } });
    }

    @Query(() => User, { nullable: true })
    user(@Arg('id') id: string) {
        return prisma.user.findUnique({ where: { id } });
    }

    @ValidateSchemas()
    @Mutation(() => User)
    async modifyUser(
        @Arg('id') id: string,
        @Arg('data') data: UpdateUserInput,
    ) {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new GqlHttpException('User not found', HttpStatus.NOT_FOUND);

        const validationErrors: { property: string; reasons: string[] }[] = [];

        const checkAndSetNewPassword = async () => {
            if (!data.password) return;

            // TODO: write logic when password is unsetted
            if (!user.password)
                throw new GqlHttpException(
                    'Password is not setted',
                    HttpStatus.BAD_REQUEST,
                );

            const errorsList: string[] = [];

            if (!data.newPassword)
                errorsList.push(
                    "Field must be specified in pair with 'newPassword'",
                );

            if (data.password === data.newPassword)
                errorsList.push(
                    "Fields 'password' and 'newPassword' must differ",
                );

            if (!(await compare(data.password, user.password)))
                errorsList.push('Password does not match saved');

            if (errorsList.length == 0 && data.newPassword) {
                user.password = await hash(data.newPassword);
            }

            if (errorsList.length > 0) {
                validationErrors.push({
                    property: 'password',
                    reasons: errorsList,
                });
            }
        };

        const checkAndSetUsername = async () => {
            if (!data.username) return;

            if (data.username == user.username)
                return validationErrors.push({
                    property: 'username',
                    reasons: ['Username must differ from current'],
                });

            if (
                await prisma.user.findFirst({
                    where: { username: data.username },
                })
            )
                return validationErrors.push({
                    property: 'username',
                    reasons: ['Username already used'],
                });

            user.username = data.username;
        };

        const checkAndSetEmail = async () => {
            if (!data.email) return;

            if (data.email == user.email)
                return validationErrors.push({
                    property: 'email',
                    reasons: ['Email must differ from current'],
                });

            // TODO: Temporary, remove in next version
            if (await prisma.user.findFirst({ where: { email: data.email } }))
                return validationErrors.push({
                    property: 'email',
                    reasons: ['Email already used'],
                });

            const code = randomUUID();
            await redis.set(
                `confirmation:change-email:${code}`,
                JSON.stringify({ id: user.id, email: data.email }),
                {
                    EX: 300,
                },
            );
            if (!user.email)
                return validationErrors.push({
                    property: 'email',
                    reasons: ['Email is not exists'],
                });

            const info = await sendEmailChangeConfirmationMail(
                user.email,
                `https://animakuro.domain/change-email/${code}`,
                data.email,
            );
            console.log(previewUrl(info)); // TODO: REMOVE!
        };

        const checkAndSetBirthday = () => {
            if (!data.birthday) return;

            if (data.birthday.getTime() > Date.now())
                return validationErrors.push({
                    property: 'birthday',
                    reasons: ['Wierd date'],
                });

            user.birthday = data.birthday;
        };

        const checkAndSetGender = () => {
            if (!data.gender) return;

            switch (data.gender) {
                case Gender.CUSTOM:
                    if (!data.customGender)
                        return validationErrors.push({
                            property: 'gender',
                            reasons: [
                                "For 'CUSTOM' u must also specify 'customGender' field",
                            ],
                        });

                    user.customGender = data.customGender;
                    break;
                default:
                    user.customGender = null;
                    break;
            }

            user.gender = data.gender;
        };

        await Promise.all([
            checkAndSetNewPassword(),
            checkAndSetUsername(),
            checkAndSetEmail(),
        ]);

        checkAndSetBirthday();
        checkAndSetGender();

        // TODO: write data.avatar & data.banner handlers

        if (validationErrors.length > 0)
            throw new GqlHttpException(
                validationErrors,
                HttpStatus.BAD_REQUEST,
                'validationErrors',
            );

        return await prisma.user.update({
            where: { id: user.id },
            data: { ...user },
        });
    }

    @Mutation(() => User)
    @Authorized()
    @ValidateSchemas()
    async createUser(
        @Arg('data', () => CreateUserInput) data: CreateUserInput,
        @Ctx() ctx: ICustomContext,
    ) {
        const { userJwtPayload } = ctx;
        if (!userJwtPayload) {
            throw new GqlHttpException(
                'not authorized',
                HttpStatus.BAD_REQUEST,
            );
        }
        if (!data.username)
            throw new GqlHttpException(
                'username is empty',
                HttpStatus.BAD_REQUEST,
            );

        if (!data.password)
            throw new GqlHttpException(
                'password is empty',
                HttpStatus.BAD_REQUEST,
            );

        const checkUsername = await this.userService.findUserByUsername(
            data.username,
        );

        if (checkUsername) {
            throw new GqlHttpException(
                'Username already used',
                HttpStatus.BAD_REQUEST,
            );
        }

        const savedUser = await this.userService.findUserById(
            userJwtPayload.uid,
        );

        if (!savedUser)
            throw new GqlHttpException(
                'There are no saved user by this email',
                HttpStatus.NOT_FOUND,
            );
        if (!savedUser.email)
            throw new GqlHttpException(
                'email is empty',
                HttpStatus.BAD_REQUEST,
            );

        const checkUsersCount = await this.userService.getUserEmailCount(
            savedUser.email,
        );

        if (checkUsersCount >= 5) {
            throw new GqlHttpException(
                'Too Many accounts',
                HttpStatus.BAD_REQUEST,
            );
        }

        const hashedPassword = await hash(data.password);

        return await this.userService.createUser({
            ...data,
            username: data.username,
            email: savedUser.email,
            password: hashedPassword,
        });
    }
}