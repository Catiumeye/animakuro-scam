import { PrismaService } from '../../../common/services/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import {
    CreateFileInput,
    Resources,
    ResponseFileSource,
} from '../types/fileUpload.types';
import { CdnService } from './cdn.service';
import { FileUploadDto } from '../interfaces/upload.interface';

@Injectable()
export class FileUploadService {
    constructor(
        private prisma: PrismaService,
        private cdnService: CdnService,
    ) {}

    randomNum(min: any | number, max: any | number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    async uploadFileToCDN(file: FileUploadDto) {
        const { ids, urls } = await this.cdnService.upload([file]);
        const [id] = ids;
        const [url] = urls;
        console.log({ ids, id, urls, url });
        return url;
    }

    async uploadFilesToCDN(files: FileUploadDto[]) {
        const { ids, urls } = await this.cdnService.upload(files);
        console.log({ ids, urls });
        return urls;
    }

    deleteFromCDN(resourceId: string, url: string, cdnBucket: string) {
        return this.cdnService.delete(resourceId, url, cdnBucket);
    }

    deleteFromDB(resourceId: string, cdnBucket: string) {
        return this.prisma.resources.delete({
            where: {
                resourceId,
            },
        });
    }
}
