import { BaseResultsType } from "@app/common/models/results";
import { MarkdownDataAnime, MarkdownDataAuthor, MarkdownDataCharacter, MarkdownDataStudio } from "@app/common/models/results/markdown.results.type";
import { createUnionType, Field, Float, ID, Int, ObjectType, registerEnumType } from "@nestjs/graphql";


const MarkdownDataUnion = createUnionType({
    name: 'MarkdownDataUnion',
    types: () => [MarkdownDataAnime, MarkdownDataStudio, MarkdownDataAuthor, MarkdownDataCharacter] as const,
    resolveType(value) {        
        if (value.entity === 'studio') {
            return MarkdownDataStudio;
        }
        if (value.entity === 'anime') {
            return MarkdownDataAnime;
        }
        if (value.entity === 'author') {
            return MarkdownDataAuthor;
        }
        if (value.entity === 'character') {
            return MarkdownDataCharacter;
        }
        return null;
    }
  });

@ObjectType()
export class GetMarkdownCollectionResultsType extends BaseResultsType {
    @Field(() => String, {
        nullable: true,
        description: 'Markdown'
    })
    markdown?: string;

    @Field(() => [MarkdownDataUnion], {
        nullable: true,
        description: 'Parsed data'
    })
    data?: Array<typeof MarkdownDataUnion>;
}