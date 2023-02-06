import { GraphQLUpload } from 'graphql-upload';
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IUpload } from '../interfaces/upload.interface';

export type ResponseFileSource = {
    urls: string[];
    ids: string[];
};

@InputType()
export class CreateFileInput {
    @Field(() => GraphQLUpload)
    file: IUpload;
}

@ObjectType('ResourcesOutput')
export class Resources {
    @Field(() => String)
    userId: string;

    @Field(() => String)
    cdnBucket: string;

    @Field(() => String)
    resourceId: string;
}

@ObjectType('UploadCdnOutput')
export class UploadCdnResponce {
    @Field(() => [String])
    urls: string[];

    @Field(() => [String])
    ids: string[];
}

@ObjectType('DeleteCdnUtput')
export class DeleteCdnResponce {
    @Field(() => Boolean)
    success: boolean;

    @Field(() => String)
    message: string;
}
