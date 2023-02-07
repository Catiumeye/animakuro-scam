import { Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import {
    DeleteFileResultsType,
    UploadFileResultsType,
} from '../types/fileUpload.types';

@ObjectType()
export class UploadMutationType {
    @Field(() => UploadFileResultsType, { description: 'Upload file' })
    uploadFileToCDN: UploadFileResultsType;

    @Field(() => UploadFileResultsType, { description: 'Upload files' })
    uploadFilesToCDN: UploadFileResultsType;

    @Field(() => DeleteFileResultsType, { description: 'Delete file' })
    deleteFile: DeleteFileResultsType;
}

@Resolver()
export class UploadRootResolver {
    @Mutation(() => UploadMutationType, { description: 'Upload mutation' })
    uploadMutations() {
        return {};
    }
}
