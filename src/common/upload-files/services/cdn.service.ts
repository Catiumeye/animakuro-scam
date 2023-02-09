import { PrismaService } from '../../services/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CdnClient from '@animakuro/animakuro-cdn';
import { IUpload } from '../interfaces/upload.interface';
import pass from '../../config/buckets';

@Injectable()
export class CdnService {
    private cdnClient;
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        const url = this.configService.getOrThrow<string>('CDN_URL');
        const buckets = pass[0].bucket;
        this.cdnClient = new CdnClient(url, buckets);
    }

    async upload(files: IUpload[]) {
        const streams = files.map((file) => {
            return file.createReadStream();
        });
        try {
            const bucket_name = JSON.parse(pass[0].bucket)
                .map((item: { name: string }) => item.name)
                .toString();
            const files = await this.cdnClient.uploadFilesFromStreams(
                streams,
                bucket_name,
            );
            /*const urls = files?.urls || [];
            const ids = files?.ids || [];
            Promise.all(
                urls.map((url: string, i: number) => {
                    const id = ids[i];
                    this.uploadDataInToDB({
                        uploader: 'uploader',
                        file_id: id,
                        cdn_bucket: bucket_name,
                    });
                }),
            ); */
            return files;
        } catch (error: any) {
            throw new HttpException(
                `Could not save image, ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }
    async delete(id: string, bucket_name: string): Promise<any> {
        try {
            const resp = await this.cdnClient.deleteFileById(id, bucket_name);
            if (!resp?.success) {
                throw new HttpException(
                    `Could not delete image`,
                    HttpStatus.BAD_REQUEST,
                );
            } else {
                await this.deleteDataInToDB(id);
                return resp;
            }
        } catch (error: any) {
            throw new HttpException(
                `Could not delete image, ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async uploadDataInToDB(data: any) {
        console.log('uploading into db');
        return this.prisma.resources.create({ data });
    }

    async deleteDataInToDB(file_id: string | undefined) {
        console.log('delete from db');
        return this.prisma.resources.delete({ where: { file_id } });
    }
}
