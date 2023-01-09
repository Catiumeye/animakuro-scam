import { Global, Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
        }),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 0,
        }),
        CommonModule,
        CoreModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
