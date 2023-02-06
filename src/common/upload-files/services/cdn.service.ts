import { PrismaService } from '../../services/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CdnClient from '@animakuro/animakuro-cdn';
import { IUpload } from '../interfaces/upload.interface';

@Injectable()
export class CdnService {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        this.initCdnClient();
    }

    initCdnClient() {
        const url = this.configService.getOrThrow<string>('CDN_URL');
        const buckets = JSON.parse(
            this.configService.getOrThrow<string>('CDN_BUCKET'),
        );
        this.cdnClient = new CdnClient(url, buckets);
    }

    private cdnClient: CdnClient;

    async upload(files: IUpload[]) {
        const streams = files.map((file) => {
            return file.createReadStream();
        });
        try {
            return await this.cdnClient.uploadFilesFromStreams(
                streams,
                'test1',
            );
        } catch (error: any) {
            throw new HttpException(
                `Could not save image, ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }
    async delete(id: string, bucket_name: string) {
        try {
            return await this.cdnClient.deleteFileById(id, bucket_name);
        } catch (error: any) {
            throw new HttpException(
                `Could not delete image, ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
