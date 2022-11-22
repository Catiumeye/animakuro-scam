import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Studio, StudioInput } from '../studio/studio.schema';

@ObjectType()   
export class Movie {
    @Field(() => ID)
    id: string;

    @Field()
    createdAt: Date;

    @Field()
    deleted: boolean;

    @Field()
    name: string;

    @Field(() => Studio)
    studio: Studio
}

@InputType()
export class MovieStudioInput {
    @Field()
    id: string;
}

@InputType()
export class MovieInput {
    @Field({ nullable: true})
    name: string;

    @Field({ nullable: true})
    studio: MovieStudioInput;
}
