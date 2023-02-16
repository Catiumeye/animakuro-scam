import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import {
    StatisticQueryType,
    StatisticRootResolver,
} from './statistic-root.resolver';
import {
    GetUserStatisticFolderResultsType,
    GetUserStatisticFavouriteResultsType,
} from '../models/results';
import { StatisticService } from '../services/statistic.service';
import { AccessToken } from 'common/decorators';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards';
import { AuthMiddleware } from '../../../common/middlewares/auth.middleware';
import { GetStatisticFolderInputType } from '../models/inputs';
@Resolver(StatisticQueryType)
export class StatisticQueryResolver extends StatisticRootResolver {
    constructor(private statisticService: StatisticService) {
        super();
    }

    @ResolveField(() => GetUserStatisticFolderResultsType, {
        middleware: [AuthMiddleware],
    })
    @UseGuards(JwtAuthGuard)
    async getUserStatisticFolder(
        @AccessToken() user_id: string,
        @Args({ nullable: true }) args?: GetStatisticFolderInputType,
    ): Promise<GetUserStatisticFolderResultsType> {
        return await this.statisticService.getUserStatisticFolder({
            ...args,
            id: args?.id ?? user_id,
        });
    }

    @ResolveField(() => GetUserStatisticFavouriteResultsType, {
        middleware: [AuthMiddleware],
    })
    @UseGuards(JwtAuthGuard)
    async getUserStatisticFavourite(
        @AccessToken() user_id: string,
        @Args('id', { nullable: true }) id?: string,
    ): Promise<GetUserStatisticFavouriteResultsType> {
        return await this.statisticService.getUserStatisticFavourite(
            id ?? user_id,
        );
    }
}