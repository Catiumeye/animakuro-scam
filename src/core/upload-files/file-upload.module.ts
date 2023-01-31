import { PrismaService } from '../../common/services/prisma.service';
import { Module } from '@nestjs/common';
import { FileResolver } from './resolvers/fileUpload.resolver';
import { FileUploadService } from './services/fileUpload.service';

@Module({
    providers: [FileUploadService, FileResolver, PrismaService],
    exports: [FileUploadService],
})
export class FileUploadModule {}
