import { PrismaService } from '../../common/services/prisma.service';
import { Module } from '@nestjs/common';
import { FileResolver } from './resolvers/file-upload.resolver';
import { FileUploadService } from './services/file-upload.service';
import { ConfigModule } from '@nestjs/config';
import { CdnService } from './services/cdn.service';

@Module({
    imports: [ConfigModule],
    providers: [FileUploadService, FileResolver, PrismaService, CdnService],
    exports: [FileUploadService],
})
export class FileUploadModule {}
