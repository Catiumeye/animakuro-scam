import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { CreateUserFolderInputType } from '../models/inputs/create-user-folder-input.type';
import {
    UserFolderMutationType,
    UserFolderRootResolver,
} from './user-folder-root.resolver';
import { CreateUserFolderResultsType } from '../models/results/create-user-folder-results.type';
import { UpdateUserFolderResultsType } from '../models/results/update-user-folder-results.type';
import { UpdateUserFolderInputType } from '../models/inputs/update-user-folder-input.type';
import { DeleteUserFolderResultsType } from '../models/results/delete-user-folder-results.type';
import { UserFolderService } from '../services/user-folder.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards';
import { AccessToken } from '../../../common/decorators';
import { AuthMiddleware } from '../../../common/middlewares/auth.middleware';

@Resolver(UserFolderMutationType)
export class UserFolderMutationResolver extends UserFolderRootResolver {
    constructor(private userFolderService: UserFolderService) {
        super();
    }

    @ResolveField(() => CreateUserFolderResultsType, {
        middleware: [AuthMiddleware],
    })
    @UseGuards(JwtAuthGuard)
    async createUserFolder(
        @AccessToken() user_id: string,
        @Args() args: CreateUserFolderInputType,
    ): Promise<CreateUserFolderResultsType> {
        return await this.userFolderService.createUserFolder(args, user_id);
    }

    @ResolveField(() => UpdateUserFolderResultsType, {
        middleware: [AuthMiddleware],
    })
    @UseGuards(JwtAuthGuard)
    async updateUserFolder(
        @Args() args: UpdateUserFolderInputType,
    ): Promise<UpdateUserFolderResultsType> {
        return await this.userFolderService.updateUserFolder(args);
    }

    @ResolveField(() => DeleteUserFolderResultsType, {
        middleware: [AuthMiddleware],
    })
    @UseGuards(JwtAuthGuard)
    async deleteUserFolder(
        @Args('id') id: string,
    ): Promise<DeleteUserFolderResultsType> {
        return await this.userFolderService.deleteUserFolder(id);
    }
}
