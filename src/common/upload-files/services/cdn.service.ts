import { PrismaService } from '../../services/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CdnClient from '@animakuro/animakuro-cdn';
import { IUpload } from '../interfaces/upload.interface';


@Injectable()
export class CdnService {
    private cdnClient;
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        const url = this.configService.getOrThrow<string>('CDN_URL');
        const buckets = JSON.parse(
            this.configService.getOrThrow<string>('CDN_BUCKET'),
        );
        this.cdnClient = new CdnClient(url, buckets);
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
                        cdn_bucket: url.split('.com/')[1].split('/')[0],
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
    async delete(id: string, bucket_name: string) {
        try {
            const [dt1, _] = await Promise.all([
                this.cdnClient.deleteFileById(id, bucket_name),
                this.deleteDataInToDB(id),
            ]);
            return dt1;
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
