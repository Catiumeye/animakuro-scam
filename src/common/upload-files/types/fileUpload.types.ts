import { GraphQLUpload } from 'graphql-upload';
import {
    InputType,
    Field,
    ObjectType,
    GraphQLISODateTime,
} from '@nestjs/graphql';
import { IUpload } from '../interfaces/upload.interface';

@InputType()
export class CreateFileInput {
    @Field(() => GraphQLUpload)
    file: IUpload;
}
@InputType()
export class InputFilesType {
    @Field(() => String)
    cdn_bucket: string;
}

@ObjectType()
export class GetFilesResultsType {
    @Field(() => GraphQLISODateTime)
    created_at: Date;

    @Field(() => String)
    uploader: string;

    @Field(() => String)
    file_id: string;

    @Field(() => String)
    cdn_bucket: string;
}

@ObjectType('UploadFile')
export class UploadFileResultsType {
    @Field(() => [String])
    urls: string[];

    @Field(() => [String])
    ids: string[];
}

@ObjectType('DeleteFile')
export class DeleteFileResultsType {
    @Field(() => Boolean)
    success: boolean;

    @Field(() => String)
    message: string;
}
