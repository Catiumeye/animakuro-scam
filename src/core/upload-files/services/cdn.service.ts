import { SendFilesFromStreams } from '@animakuro/animakuro-cdn';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUploadDto } from '../interfaces/upload.interface';

@Injectable()
export class CdnService {
    constructor(private configService: ConfigService) {}

    async upload(files: FileUploadDto[]) {
        const streams = files.map((file) => file.createReadStream());

        const url = this.configService.getOrThrow<string>('CDN_URL');
        const bucket = this.configService.getOrThrow<string>('CDN_BUCKET');

        try {
            return await SendFilesFromStreams(streams, url, bucket);
        } catch (error: any) {
            throw new HttpException(
                `Could not save image, ${error.message}`,
                HttpStatus.BAD_REQUEST,
            );
        }
    }
}
