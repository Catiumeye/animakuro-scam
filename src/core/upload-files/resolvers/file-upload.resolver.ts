import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { FileUploadService } from '../services/file-upload.service';
import { GraphQLUpload } from 'graphql-upload';
import { FileUploadDto } from '../interfaces/upload.interface';
import { Resources } from '../types/fileUpload.types';

@Resolver()
export class FileResolver {
    constructor(private readonly FUService: FileUploadService) {}

    @Mutation(() => Resources)
    async uploadFileToCDN(
        @Args({ name: 'file', type: () => GraphQLUpload })
        file: FileUploadDto,
    ): Promise<any> {
        return this.FUService.uploadFileToCDN(file);
    }

    @Mutation(() => [Resources])
    async uploadFilesToCDN(
        @Args('files', { type: () => [GraphQLUpload] })
        fileList: FileUploadDto[],
    ): Promise<string[]> {
        return this.FUService.uploadFilesToCDN(fileList);
    }

    @Mutation(() => Boolean)
    async deleteFile(
        @Args('url', { type: () => String })
        url: string,
    ) {
        const [cdnBucket, resourceId] = url.split('/');
        const deletingFromCDN = this.FUService.deleteFromCDN(
            resourceId,
            url,
            cdnBucket,
        );
        const deletingFromDB = this.FUService.deleteFromDB(
            resourceId,
            cdnBucket,
        );
        await Promise.all([deletingFromCDN, deletingFromDB]);
        return true;
    }
}
