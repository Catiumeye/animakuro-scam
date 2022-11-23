import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Studio, StudioInput } from '../studio/studio.schema';

@ObjectType()   
export class Series {
    @Field(() => ID)
    id: string;

    @Field()
    createdAt: Date;

    @Field()
    deleted: boolean;

    @Field()
    name: string;

    @Field(() => Studio, { nullable: true })
    studio?: Studio
}

@InputType()
export class SeriesStudioInput {
    @Field()
    id: string;
}

@InputType()
export class SeriesInput {
    @Field({ nullable: true})
    name: string;

    @Field({ nullable: true})
    studio?: SeriesStudioInput;
}
