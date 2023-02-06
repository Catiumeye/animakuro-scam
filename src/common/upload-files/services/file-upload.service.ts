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

    async uploadFileToCDN(file: IUpload) {
        return this.cdnService.upload([file]);
    }

    async uploadFilesToCDN(files: IUpload[]) {
        return this.cdnService.upload(files);
    }

    async deleteFromCDN(id: string) {
        return this.cdnService.delete(id, 'test1');
    }
}
