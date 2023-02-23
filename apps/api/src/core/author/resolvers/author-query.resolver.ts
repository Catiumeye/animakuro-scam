import { fieldsMap } from 'graphql-fields-list';
import { Args, Info, ResolveField, Resolver } from '@nestjs/graphql';

import { AccessToken } from '@app/common/decorators';
import { AuthMiddleware } from '@app/common/middlewares/auth.middleware';
import { PaginationInputType } from '@app/common/models/inputs';

import { GetListAuthorResultsType } from '../models/results/get-list-author-results.type';
import { GetAuthorResultsType } from '../models/results/get-author-results.type';
import { AuthorService } from '../services/author.service';

import { AuthorQueryType, AuthorRootResolver } from './author-root.resolver';

@Resolver(AuthorQueryType)
export class AuthorQueryResolver extends AuthorRootResolver {
    constructor(private authorService: AuthorService) {
        super();
    }

    @ResolveField(() => GetAuthorResultsType, { middleware: [AuthMiddleware] })
    async getAuthor(
        @Args('id') id: string,
        @Info() info: any,
        @AccessToken() userId: string,
    ): Promise<GetAuthorResultsType> {
        return await this.authorService.getAuthor(
            id,
            userId,
            JSON.stringify(fieldsMap(info)).includes('is_favourite'),
        );
    }

    @ResolveField(() => GetListAuthorResultsType, {
        middleware: [AuthMiddleware],
    })
    async getAuthorList(
        @Args() args: PaginationInputType,
        @AccessToken() userId: string,
        @Info() info: any,
    ): Promise<GetListAuthorResultsType> {
        return await this.authorService.getAuthorList(
            args,
            userId,
            JSON.stringify(fieldsMap(info)).includes('is_favourite'),
        );
    }

    @ResolveField(() => GetListAuthorResultsType, {
        middleware: [AuthMiddleware],
    })
    async getAuthorListByAnimeId(
        @Args('id') id: string,
        @Args() args: PaginationInputType,
        @AccessToken() userId: string,
        @Info() info: any,
    ): Promise<GetListAuthorResultsType> {
        return await this.authorService.getAuthorListByAnimeId(
            id,
            args,
            userId,
            JSON.stringify(fieldsMap(info)).includes('is_favourite'),
        );
    }
}
