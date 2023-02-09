import { Resolver, Args, ResolveField } from '@nestjs/graphql';
import { FileUploadService } from '../services/file-upload.service';
import {
    DeleteFileResultsType,
    UploadFileResultsType,
} from '../types/fileUpload.types';
import { FilesUploadDto, FileUploadDto } from '../interfaces/upload.interface';
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
    async uploadFileToCDN(@Args() { file }: FileUploadDto): Promise<any> {
        return this.FUService.uploadFileToCDN(await file);
    }

    @ResolveField(() => UploadFileResultsType)
    async uploadFilesToCDN(@Args() { files }: FilesUploadDto): Promise<any> {
        return this.FUService.uploadFilesToCDN(await Promise.all(files));
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
