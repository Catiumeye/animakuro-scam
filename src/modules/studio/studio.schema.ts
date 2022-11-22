import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Movie, MovieInput } from '../movie/movie.schema';

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

    @Field(() => [Movie])
    movies?: Movie[]
}

@InputType()
export class StudioInput {
    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    genre: string;

    @Field({ nullable: true })
    existencePeriod: string;

    @Field({ nullable: true })
    rating: string;

    @Field({ nullable: true })
    grade: string;

    @Field({ nullable: true })
    timekeeping: string;

    @Field({ nullable: true })
    thumbnail: string;
}
