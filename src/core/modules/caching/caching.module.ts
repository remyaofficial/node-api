import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CachingService } from './caching.service';
import * as redisStore from 'cache-manager-redis-store';
import redisConfig from '../../../config/redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          load: [redisConfig],
        }),
      ],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        ttl: 60 * 60 * 24 * 10, // 10 days
        ...config.get('redis'),
      }),
    }),
  ],
  exports: [CacheModule],
  providers: [CachingService],
})
export class CachingModule {}
