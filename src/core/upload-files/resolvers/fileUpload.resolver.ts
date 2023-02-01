import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { FileUploadService } from '../services/file-upload.service';
import { GraphQLUpload } from 'graphql-upload';
import { FileUploadDto } from '../interfaces/upload.interface';
import { Resources } from '../types/fileUpload.types';

@Resolver()
export class FileResolver {
    constructor(private readonly FUService: FileUploadService) {}

    @Mutation(() => Resources)
    async uploadFile(
        @Args({ name: 'file', type: () => GraphQLUpload })
        file: FileUploadDto,
    ): Promise<any> {
        const { mimetype } = file;
        if (mimetype.match(/^image\/(jpeg|gif)$/)) {
            return this.FUService.createFile({ file });
        } else {
            throw new Error(`File wasn't mime(${mimetype}) type correctly`);
        }
    }

    @Mutation(() => Resources)
    async uploadFileToCdn(
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

    @Mutation(() => [Resources])
    async uploadFiles(
        @Args('files', { type: () => [GraphQLUpload] })
        fileList: FileUploadDto[],
    ): Promise<FileUploadDto[]> {
        const files: Resources[] = [];
        (await Promise.all(fileList)).forEach(async (file) => {
            files.push(await this.FUService.createFile({ file }));
        });
        return files as any[];
    }

    @Mutation(() => Boolean)
    async deleteFile(
        @Args('url', { type: () => String })
        resourceId: string,
    ) {
        const deletingFromDB = await this.FUService.deleteDataInToDB(
            resourceId,
        );
        return true;
    }
}
