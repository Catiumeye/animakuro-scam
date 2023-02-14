import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { DeleteStudioResultsType } from '../models/results/delete-studio-results.type';
import { StudioMutationType, StudioRootResolver } from './studio-root.resolver';
import { UpdateStudioInputType } from '../models/inputs/update-studio-input.type';
import { UpdateStudioResultsType } from '../models/results/update-studio-results.type';
import { CreateStudioResultsType } from '../models/results/create-studio-results.type';
import { CreateStudioInputType } from '../models/inputs/create-studio-input.type';
import { StudioService } from '../services/studio.service';
import { AuthMiddleware } from '../../../common/middlewares/auth.middleware';
import { UseGuards } from '@nestjs/common';
import { AccessToken } from '../../../common/decorators';
import { JwtAuthGuard } from '../../../common/guards';

@Resolver(StudioMutationType)
export class StudioMutationResolver extends StudioRootResolver {
    constructor(private studioService: StudioService) {
        super();
    }

    @ResolveField(() => CreateStudioResultsType, {
        middleware: [AuthMiddleware]
    })
    @UseGuards(JwtAuthGuard)
    async createStudio(
        @Args() args: CreateStudioInputType,
    ): Promise<CreateStudioResultsType> {
        return await this.studioService.createStudio(args);
    }

    @ResolveField(() => UpdateStudioResultsType, {
        middleware: [AuthMiddleware]
    })
    @UseGuards(JwtAuthGuard)
    async updateStudio(
        @Args() args: UpdateStudioInputType,
    ): Promise<UpdateStudioResultsType> {
        return await this.studioService.updateStudio(args);
    }

    @ResolveField(() => DeleteStudioResultsType, {
        middleware: [AuthMiddleware]
    })
    @UseGuards(JwtAuthGuard)
    async deleteStudio(
        @Args('id') id: string,
    ): Promise<DeleteStudioResultsType> {
        return await this.studioService.deleteStudio(id);
    }
}
