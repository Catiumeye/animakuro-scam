import { ResolveField, Resolver, Args } from '@nestjs/graphql';
import { FilesQueryType, UploadRootResolver } from './upload-root.resolver';
import { FileUploadService } from '../services/file-upload.service';
import {
    GetFilesResultsType,
    InputFilesType
} from '../types/fileUpload.types';

@Resolver(FilesQueryType)
export class FilesQueryResolver extends UploadRootResolver {
    constructor(private readonly FUService: FileUploadService) {
        super();
    }

    @ResolveField(() => GetFilesResultsType)
    async getFiles(
        @Args('cdn_bucket', { description: 'cdn bucket name' })
        { cdn_bucket }: InputFilesType,
    ): Promise<ResourceOutArray> {
        const elems = await this.FUService.getFiles(cdn_bucket);
        return elems;
    }
}
