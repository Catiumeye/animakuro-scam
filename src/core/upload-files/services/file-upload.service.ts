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

    async createFile({ file }: CreateFileInput): Promise<Resources> {
        const { createReadStream, filename } = file;
        try {
            await new Promise((resolve, reject) =>
                createReadStream()
                    .pipe(createWriteStream(`./uploads/${filename}`))
                    .on('finish', resolve)
                    .on('error', reject),
            );
            return await this.uploadDataInToDB(
                'userId',
                `./uploads/${filename}`,
                filename,
            );
        } catch (error: any) {
            throw new HttpException(
                `Could not save image, ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
        }
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

    async uploadFormDataInToCDN(
        baseUrl: string,
        bucket: string,
        formData: FormData,
    ): Promise<ResponseFileSource> {
        const url = baseUrl + '/' + bucket;
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            const data: ResponseFileSource = await response.json();
            return data;
        } catch (er) {
            throw er;
        }
    }

    async uploadDataInToDB(
        userId: string,
        cdnBucket: string,
        resourceId: string,
    ) {
        console.log('uploading into db');
        return this.prisma.resources.create({
            data: {
                userId,
                cdnBucket,
                resourceId,
            },
        });
    }

    async deleteDataInToDB(resourceId: string) {
        return await this.prisma.resources.delete({
            where: {
                resourceId,
            },
        });
    }
}
