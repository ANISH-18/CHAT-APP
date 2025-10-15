import { Logger, Module } from '@nestjs/common';
import { RedisConnectionService } from './redis-client.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get('REDIS_HOST');
        Logger.log('REDIS HOST', host);
        const port = configService.get('REDIS_PORT');
        Logger.log('REDIS PORT', port);

        return {
          readyLog: true,
          config: {
            host,
            port,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [RedisConnectionService],
  exports: [RedisConnectionService],
})
export class RedisClientModule {}
