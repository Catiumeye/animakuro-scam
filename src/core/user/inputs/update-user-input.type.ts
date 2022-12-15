import { GraphQLUpload } from 'graphql-upload';
import {
    IsEmail,
    IsOptional,
    IsString,
    Length,
    ValidateIf,
} from 'class-validator';
import { ArgsType, Field, ID } from 'type-graphql';
import { Gender } from '../../../common/models/enums/gender.enum';
import { IUpload } from '../../../common/models/interfaces/upload.interface';

@ArgsType()
export class UpdateUserInputType {
    @Field(() => ID)
    id: string;

    @IsOptional()
    @Field(() => String, { nullable: true })
    @Length(1, 64)
    username: string;

    @IsOptional()
    @Field(() => String, { nullable: true })
    @Length(1, 320)
    @IsEmail()
    email: string;

    @IsString()
    @ValidateIf((o) => o.newPassword)
    @Field(() => String, { nullable: true })
    password: string;

    @IsString()
    @ValidateIf((o) => o.password)
    @Field(() => String, { nullable: true })
    newPassword: string;

    @Field(() => Date, { nullable: true })
    birthday: Date;

    @Field(() => Gender, { nullable: true })
    gender: Gender;

    @Field(() => String, { nullable: true })
    customGender: string;

    @Field(() => GraphQLUpload, { nullable: true })
    avatar: IUpload;

    @Field(() => GraphQLUpload, { nullable: true })
    banner: IUpload;
}
