import { PrismaService } from '../../services/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CdnClient from '@animakuro/animakuro-cdn';
import { IUpload } from '../interfaces/upload.interface';

@Injectable()
export class CdnService {
    private cdnClient;
    url: string;
    buckets: string;
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        this.url = this.configService.getOrThrow<string>('CDN_URL');
        this.buckets = JSON.parse(
            this.configService.getOrThrow<string>('CDN_BUCKET'),
        );
        this.cdnClient = new CdnClient(this.url, this.buckets);
    }

    async upload(files: IUpload[]) {
        const streams = files.map((file) => {
            return file.createReadStream();
        });
        try {
            const files = await this.cdnClient.uploadFilesFromStreams(
                streams,
                'test1',
            );
            const urls = files?.urls || [];
            const ids = files?.ids || [];
            Promise.all(
                urls.map((url: string, i: number) => {
                    const id = ids[i];
                    this.uploadDataInToDB({
                        uploader: 'uploader',
                        file_id: id,
                        cdn_bucket: 'test1',
                    });
                }),
            );
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

    async getFiles(cdn_bucket: string) {
        console.log('get images from db');
        const elems = await this.prisma.resources.findMany({
            where: {
                cdn_bucket,
            },
        });
        return  elems.map((e) => ({
            ...e,
            
            url: `${this.url}${e.cdn_bucket}/${e.file_id}`,
        }));
    }
}
