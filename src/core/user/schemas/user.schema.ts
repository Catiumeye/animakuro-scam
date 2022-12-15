import { Field, ID, ObjectType } from 'type-graphql';
import { Gender } from '../../../common/models/enums/gender.enum';
import { UserThirdParty } from './user-third-party.schema';

@ObjectType()
export class User {
    @Field(() => ID)
    id = '0';

    @Field(() => String)
    username = 'CUSTOM_USERNAME';

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    avatar?: string;

    @Field({ nullable: true })
    banner?: string;

    @Field({ nullable: true })
    birthday?: Date;

    @Field(() => Gender, { defaultValue: Gender.UNSPECIFIED })
    gender = Gender.UNSPECIFIED;

    @Field(() => String, { nullable: true })
    customGender?: string | null;

    @Field(() => UserThirdParty, { nullable: true })
    thirdPartyAuth?: UserThirdParty;
}
