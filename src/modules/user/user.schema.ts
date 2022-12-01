import { Field, ID, ObjectType, registerEnumType } from 'type-graphql'

export enum Gender {
    UNSPECIFIED = "UNSPECIFIED",
    MALE = "MALE",
    FEMALE = "FEMALE",
    CUSTOM = "CUSTOM"
}

registerEnumType(Gender, {
    name: 'Gender'
})

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field()
    username: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    avatar?: string;

    @Field({ nullable: true })
    banner?: string;

    @Field({ nullable: true })
    birthday?: Date;

    @Field({defaultValue: Gender.UNSPECIFIED})
    gender: Gender;

    @Field({ nullable: true })
    customGender?: string
}
