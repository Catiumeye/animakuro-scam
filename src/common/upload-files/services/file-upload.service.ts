import { PrismaService } from '../../services/prisma.service';
import { Injectable } from '@nestjs/common';
import { CdnService } from './cdn.service';
import { IUpload } from '../model/interface/upload.interface';
import pass from '../../config/buckets';

@Injectable()
export class FileUploadService {
    constructor(
        private prisma: PrismaService,
        private cdnService: CdnService,
    ) {}

    async uploadFileToCDN(file: IUpload) {
        return this.cdnService.upload([file]);
    }

    async uploadFilesToCDN(files: IUpload[]) {
        return this.cdnService.upload(files);
    }

    async deleteFromCDN(id: string) {
        return this.cdnService.delete(id, pass[0].bucket);
    }

    async getFiles(cdn_bucket: string) {
        return { files: this.cdnService.getFiles(cdn_bucket) };
    }
}
