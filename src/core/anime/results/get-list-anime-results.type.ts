import { Field, ObjectType } from "type-graphql";
import { BaseResultsType } from "../../../common/results/base-results.type";
import { Anime } from "../schemas/anime.schema";
import { PaginationResultsType } from "../../../common/results/pagination-results.type";

@ObjectType()
export class GetListAnimeResultsType extends BaseResultsType {
    @Field(() => [Anime], {
        nullable: true,
        description: 'Anime list',
    })
    animeList: Anime[] | null;

    @Field(() => PaginationResultsType, {
        nullable: false,
        description: 'Pagination data',
    })
    pagination: PaginationResultsType;
}
