import { Arg, Args, Ctx, FieldResolver, Resolver } from 'type-graphql';
import { ValidateSchemas } from 'common/decorators';
import { LoginInputType } from '../models/inputs/login-input.type';
import { RegisterInputType } from '../models/inputs/register-input.type';
import { ThirdPartyAuthInputType } from '../models/inputs/third-party-input.type';
import { AuthMutationType, AuthRootResolver } from './auth-root.resolver';
import { RegisterResultsType } from '../models/results/register-results.type';
import { LoginResultsType } from '../models/results/login-results.type';
import { LogoutResultsType } from '../models/results/logout-results.type';
import { ConfirmRegistrationResultsType } from '../models/results/confirm-registration-results.type';
import { LoginOrRegisterThirdPartyResultsType } from '../models/results/login-or-register-third-party-results.type';
import { Context } from "vm";

@Resolver(AuthMutationType)
export class AuthMutationResolver extends AuthRootResolver {
    constructor() {
        super();
    }

    @FieldResolver(() => RegisterResultsType)
    @ValidateSchemas()
    async register(
        @Args() args: RegisterInputType,
        @Ctx() ctx: Context,
    ): Promise<RegisterResultsType> {
        return await this.authService.register(args, ctx);
    }

    // @FieldResolver(() => ConfirmRegistrationResultsType)
    // async confirmRegistration(
    //     @Arg('code') code: string,
    // ): Promise<ConfirmRegistrationResultsType> {
    //     return await this.authService.confirmRegistrationInfo(code);
    // }

    @FieldResolver(() => LoginResultsType)
    async login(
        @Args() args: LoginInputType,
        @Ctx() ctx: Context,
    ): Promise<LoginResultsType> {
        return await this.authService.login(args, ctx);
    }

    @FieldResolver(() => LogoutResultsType)
    async logout(@Ctx() ctx: Context): Promise<LogoutResultsType> {
        return await this.authService.logout(ctx);
    }

    // @FieldResolver(() => LoginOrRegisterThirdPartyResultsType)
    // async loginOrRegisterThirdParty(
    //     @Arg('code', () => String) code: string,
    //     @Args() args: ThirdPartyAuthInputType,
    //     @Ctx() ctx: ICustomContext,
    // ): Promise<LoginOrRegisterThirdPartyResultsType> {
    //     return await this.authService.loginOrRegisterThirdPartyInfo(
    //         code,
    //         args,
    //         ctx,
    //     );
    // }
}
