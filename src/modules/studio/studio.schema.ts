import { IsEmail, Max, MinLength } from 'class-validator';
import { Field, ID, InputType, ObjectType, createUnionType, Authorized, ArgsType, Int } from 'type-graphql'

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
    rating: number;

    @Field()
    thumbnail: string;

    @Field(() => [Series])
    series?: Series[]
}

@InputType()
export class StudioInput {
    @Field()
    name: string;

    @Field()
    rating: number;
    
    @Field()
    thumbnail: string;
}

@InputType()
export class UpdateStudioInput {
    @Field({ nullable: true})
    name?: string;

    @Field({ nullable: true})
    rating?: number;
    
    @Field({ nullable: true})
    thumbnail?: string;
}


@ArgsType()
export class StudiosArgs {
    @Max(50)
    @Field(() => Int, { nullable: true })
    skip?: number;

    @Max(50)
    @Field(() => Int, { nullable: true, defaultValue: 10 })
    take?: number;

    @Field(() => String, { nullable: true })
    orderBy?: string;

    @Field(() => String, { nullable: true })
    order?: string;

    @Field(() => String, { nullable: true })
    search?: string;
}