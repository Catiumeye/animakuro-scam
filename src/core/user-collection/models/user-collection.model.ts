import { Field, ObjectType } from '@nestjs/graphql';
import { UserFolder } from '../../user-folder/models/user-folder.model';

@ObjectType()
export class UserCollection extends UserFolder {
    @Field(() => Boolean, { description: 'Is catalog public?' })
    is_public: boolean;
}