import { Field, ID, InputType, ObjectType } from 'type-graphql'

import { Series } from './../series/series.schema';


@ObjectType()   
export class Studio {
    @Field(() => ID)
    id: string;

    @Field()
    createdAt: Date;

    @Field()
    deleted: boolean;

    @Field()
    name: string;

    @Field()
    rating: string;

    @Field()
    thumbnail: string;

    @Field(() => [Series])
    series?: Series[]
}

@InputType()
export class StudioInput {
    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    rating: number;

    @Field({ nullable: true })
    thumbnail: string;
}
