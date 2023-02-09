import { PrismaService } from '../services/prisma.service';
import { Module } from '@nestjs/common';
import { UploadMutationResolvers } from './resolvers/file-upload.resolver';
import { FileUploadService } from './services/file-upload.service';
import { ConfigModule } from '@nestjs/config';
import { CdnService } from './services/cdn.service';
import { FilesQueryResolver } from './resolvers/file-upload-query.resolver';

@Module({
    imports: [ConfigModule],
    providers: [
        FileUploadService,
        UploadMutationResolvers,
        PrismaService,
        CdnService,
        FilesQueryResolver
    ],
    exports: [FileUploadService],
})
export class FileUploadModule {}
