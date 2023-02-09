import { GraphQLUpload } from 'graphql-upload';
import {
    InputType,
    Field,
    ObjectType,
    GraphQLISODateTime,
} from '@nestjs/graphql';
import { IUpload } from '../interfaces/upload.interface';
import { User } from '../../../core/user/models/user.model';

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
export class GetFileResultType {
    @Field(() => User)
    uploader: User;

    @Field(() => String)
    file_id: string;

    @Field(() => String)
    cdn_bucket: string;

    @Field(() => String)
    url: string;
}

@ObjectType('GetFilesResults')
export class GetFilesResultsType {
    @Field(() => [GetFileResultType])
    files: GetFileResultType[];
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
