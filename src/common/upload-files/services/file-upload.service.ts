import { PrismaService } from '../../services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CdnService } from './cdn.service';
import { IUpload } from '../interfaces/upload.interface';

@Injectable()
export class FileUploadService {
    constructor(
        private prisma: PrismaService,
        private cdnService: CdnService,
    ) {}

    randomNum(min: any | number, max: any | number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    async uploadFileToCDN(file: IUpload) {
        const uploadRes = await this.cdnService.upload([file]);
        console.log({ uploadRes });
        console.error();
    }

    async uploadFilesToCDN(files: IUpload[]) {
        const result = await this.cdnService.upload(files);
        console.error({ result });
    }

    deleteFromCDN(ids: string, urls: string) {
        return this.cdnService.delete(ids, urls);
    }

    deleteFromDB(resourceId: string, cdnBucket: string) {
        return this.prisma.resources.delete({
            where: {
                resourceId,
            },
        });
    }
}
