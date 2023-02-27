import { Args, ResolveField, Resolver } from '@nestjs/graphql';

import { AccessToken } from '@app/common/decorators';
import { AuthMiddleware } from '@app/common/middlewares/auth.middleware';
import { PaginationInputType } from '@app/common/models/inputs';

import {
    GetListUserProfileResultsType,
    GetUserProfileResultsType,
} from '../models/results';
import { UserProfileService } from '../services/user-profile.service';

import {
    UserProfileQueryType,
    UserProfileRootResolver,
} from './user-profile-root.resolver';

@Resolver(UserProfileQueryType)
export class UserProfileQueryResolver extends UserProfileRootResolver {
    constructor(private userProfileService: UserProfileService) {
        super();
    }

    @ResolveField(() => GetUserProfileResultsType, {
        middleware: [AuthMiddleware],
    })
    async getUserProfile(
        @Args('id', { nullable: true }) id: string,
        @Args('username', { nullable: true }) username: string,
        @AccessToken() user_id: string,
    ): Promise<GetUserProfileResultsType> {
        return await this.userProfileService.getUserProfile({
            user_id,
            id,
            username,
        });
    }

    @ResolveField(() => GetListUserProfileResultsType, {
        middleware: [AuthMiddleware],
    })
    async getUserProfileList(
        @Args() args: PaginationInputType,
    ): Promise<GetListUserProfileResultsType> {
        return await this.userProfileService.getUserProfileList(args);
    }
}
