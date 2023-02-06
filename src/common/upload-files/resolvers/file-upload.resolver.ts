import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { FileUploadService } from '../services/file-upload.service';
import { GraphQLUpload } from 'graphql-upload';
import {
    DeleteCdnResponce,
    UploadCdnResponce,
} from '../types/fileUpload.types';
import { IUpload } from '../interfaces/upload.interface';

@Resolver()
export class FileResolver {
    constructor(private readonly FUService: FileUploadService) {}

    @Mutation(() => UploadCdnResponce)
    async uploadFileToCDN(
        @Args({ name: 'file', type: () => GraphQLUpload })
        file: IUpload,
    ): Promise<any> {
        return this.FUService.uploadFileToCDN(file);
    }

    @Mutation(() => UploadCdnResponce)
    async uploadFilesToCDN(
        @Args('files', { type: () => [GraphQLUpload] })
        fileList: IUpload[],
    ): Promise<any> {
        return this.FUService.uploadFilesToCDN(await Promise.all(fileList));
    }

    @Mutation(() => DeleteCdnResponce)
    async deleteFile(
        @Args('id', { type: () => String })
        id: string,
    ) {
        const result = await this.FUService.deleteFromCDN(id);
        console.log(result);
        return result;
    }
}
