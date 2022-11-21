import { Field, ID, InputType, ObjectType } from 'type-graphql'

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
    genre: string;

    @Field()
    existencePeriod: string;

    @Field()
    rating: string;

    @Field()
    grade: string;
    
    @Field()
    timekeeping: string;
    
    @Field()
    thumbnail: string;
}
