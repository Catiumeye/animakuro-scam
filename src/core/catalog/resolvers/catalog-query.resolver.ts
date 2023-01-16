import { CatalogQueryType, CatalogRootResolver } from "./catalog-root.resolver";
import { GetListCatalogAnimeResultsType } from '../models/results/get-list-catalog-anime-results.type';
import { CatalogAnimeInputType } from '../models/inputs/catalog-anime-input.type';
import { CatalogService } from '../services/catalog.service';
import { Resolver, ResolveField, Args } from '@nestjs/graphql';
import { PaginationInputType } from "../../../common/models/inputs";

@Resolver(CatalogQueryType)
export class CatalogQueryResolver extends CatalogRootResolver {
    constructor(private catalogService: CatalogService) {
        super();
    }

    @ResolveField(() => GetListCatalogAnimeResultsType)
    async getCatalogAnimeList(
        @Args() args: CatalogAnimeInputType,
        @Args() pages: PaginationInputType
    ): Promise<GetListCatalogAnimeResultsType> {
        return await this.catalogService.getCatalogAnimeList(args, pages);
    }
}
