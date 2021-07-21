import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ServeStaticModule,
  ServeStaticModuleOptions,
} from '@nestjs/serve-static';
import { existsSync, mkdirSync } from 'fs';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const cdnStatic = config.get('cdnStatic');
        const cdnPath = config.get('cdnPath');
        const cdnServeRoot = config.get('cdnServeRoot');
        const paths: ServeStaticModuleOptions[] = [];
        if (!!cdnStatic) {
          existsSync(cdnPath) || mkdirSync(cdnPath);
          paths.push({
            rootPath: cdnPath,
            serveRoot: cdnServeRoot,
          });
        }
        return paths;
      },
    }),
  ],
  exports: [ServeStaticModule],
})
export class StaticPathModule {}
