import { ResolveField, Resolver } from '@nestjs/graphql';
import { FilesQueryType, UploadRootResolver } from './upload-root.resolver';
import { FileUploadService } from '../services/file-upload.service';
import { GetFilesResultsType } from '../types/fileUpload.types';
import { Resources } from '@prisma/client';

@Resolver(FilesQueryType)
export class FilesQueryResolver extends UploadRootResolver {
    constructor(private readonly FUService: FileUploadService) {
        super();
    }

    @ResolveField(() => [GetFilesResultsType])
    async getFiles(): Promise<Resources[]> {
        return await this.FUService.getFiles();
    }

}