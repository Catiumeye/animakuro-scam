import { GraphQLUpload } from 'graphql-upload';
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IUpload } from '../interfaces/upload.interface';

@InputType()
export class CreateFileInput {
    @Field(() => GraphQLUpload)
    file: IUpload;
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
