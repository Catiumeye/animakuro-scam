import { Field, InputType } from "type-graphql";

@InputType()
class CreateSeriesStudioInput {
    @Field()
    id: string;
}

@InputType()
export class CreateSeriesInput {
    @Field({ nullable: true})
    name: string;

    @Field({ nullable: true})
    studio?: CreateSeriesStudioInput;
}
