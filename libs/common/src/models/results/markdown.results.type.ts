import { Field, Float, ID, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { MarkdownArgsShape, MarkdownArgsSize, MarkdownEntities } from "../enums/markdown.enum";

@ObjectType()
class MarkdownArgs {
    @Field(() => String, {
        description: 'Columns count',
        nullable: true,
    })
    columns?: string;

    @Field(() => MarkdownArgsSize, {
        nullable: true,
    })
    size?: MarkdownArgsSize;

    @Field(() => MarkdownArgsShape, {
        nullable: true,
        description: 'Render as shape'
    })
    shape?: MarkdownArgsShape
}

@ObjectType()
class BaseDataItem {
    @Field(() => ID)
    id: string;
    
    @Field(() => String)
    title: string;
    
    @Field(() => String, {
        nullable: true
    })
    img_url?: string;

    @Field(() => Boolean, {
        nullable: true,
    })
    is_favourite?: any;
}

//DATA ITEM TYPES
@ObjectType()
class AnimeData extends BaseDataItem {
    @Field(() => Date, {
        nullable: true
    })
    date_start?: Date;
    
    @Field(() => Int, {
        nullable: true
    })
    episodes: number;
    
    @Field(() => String, {
        nullable: true
    })
    format: string;
    
    @Field(() => String, {
        nullable: true
    })
    rating?: string;
    
    @Field(() => Int, {
        nullable: true
    })
    score: number;
}

@ObjectType()
class AuthorData extends BaseDataItem {}

@ObjectType()
class CharacterData extends BaseDataItem {}

@ObjectType()
class StudioData extends BaseDataItem {   
    @Field(() => Int, {
        nullable: true,
        description: 'Count of anime'
    })
    anime_count: number;

    @Field(() => String, {
        nullable: true,
        description: 'Float value as string'
    })
    rating: string;
}
// END DATA ITEM TYPES



// RETURN DATA TYPES
@ObjectType()
class MarkdownDataBase {
    @Field(() => MarkdownEntities)
    entity: MarkdownEntities

    @Field(() => MarkdownArgs)
    args: MarkdownArgs;
}

@ObjectType()
export class MarkdownDataAnime extends MarkdownDataBase {
    @Field(() => [AnimeData])
    data: AnimeData[]
}

@ObjectType()
export class MarkdownDataStudio extends MarkdownDataBase {
    @Field(() => [StudioData])
    data: StudioData[]
}

@ObjectType()
export class MarkdownDataAuthor extends MarkdownDataBase {
    @Field(() => [AuthorData])
    data: StudioData[]
}

@ObjectType()
export class MarkdownDataCharacter extends MarkdownDataBase {
    @Field(() => [CharacterData])
    data: StudioData[]
}