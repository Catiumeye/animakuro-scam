import { Mutation, Resolver, Args, ResolveField } from '@nestjs/graphql';
import { FileUploadService } from '../services/file-upload.service';
import { GraphQLUpload } from 'graphql-upload';
import {
    DeleteFileResultsType,
    UploadFileResultsType,
} from '../types/fileUpload.types';
import { IUpload } from '../interfaces/upload.interface';
import {
    UploadMutationType,
    UploadRootResolver,
} from '../resolvers/upload-root.resolver';

@Resolver(UploadMutationType)
export class UploadMutationResolvers extends UploadRootResolver {
    constructor(private readonly FUService: FileUploadService) {
        super();
    }

    @ResolveField(() => UploadFileResultsType)
    async uploadFileToCDN(
        @Args({ name: 'file', type: () => GraphQLUpload })
        file: IUpload,
    ): Promise<any> {
        return this.FUService.uploadFileToCDN(file);
    }

    @ResolveField(() => UploadFileResultsType)
    async uploadFilesToCDN(
        @Args('files', { type: () => [GraphQLUpload] })
        fileList: IUpload[],
    ): Promise<any> {
        return this.FUService.uploadFilesToCDN(await Promise.all(fileList));
    }

    @ResolveField(() => DeleteFileResultsType)
    async deleteFile(
        @Args('id', { type: () => String })
        id: string,
    ) {
        const result = await this.FUService.deleteFromCDN(id);
        return result;
    }
}
