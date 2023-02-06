import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { FileUploadService } from '../services/file-upload.service';
import { GraphQLUpload } from 'graphql-upload';
import { UploadCdnResponce } from '../types/fileUpload.types';
import { IUpload } from '../interfaces/upload.interface';

@Resolver()
export class FileResolver {
    constructor(private readonly FUService: FileUploadService) {}

    @Mutation(() => UploadCdnResponce)
    async uploadFileToCDN(
        @Args({ name: 'file', type: () => GraphQLUpload })
        file: IUpload,
    ): Promise<any> {
        console.log({ file });
        return this.FUService.uploadFileToCDN(file);
    }

    @Mutation(() => [UploadCdnResponce])
    async uploadFilesToCDN(
        @Args('files', { type: () => [GraphQLUpload] })
        fileList: IUpload[],
    ): Promise<any> {
        console.log({ fileList });
        return this.FUService.uploadFilesToCDN(await Promise.all(fileList));
    }

    @Mutation(() => Boolean)
    async deleteFile(
        @Args('url', { type: () => String })
        url: string,
    ) {
        const [cdnBucket, resourceId] = url.split('/');
        const deletingFromCDN = this.FUService.deleteFromCDN(resourceId, url);
        const deletingFromDB = this.FUService.deleteFromDB(
            resourceId,
            cdnBucket,
        );
        await Promise.all([deletingFromCDN, deletingFromDB]);
        return true;
    }
}
