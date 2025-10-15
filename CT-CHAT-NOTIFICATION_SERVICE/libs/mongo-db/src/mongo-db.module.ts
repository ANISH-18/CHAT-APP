import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { models } from './models';
import { repositories } from './repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: async (configService: ConfigService) => {
        const mongoUrl = configService.get('MONGODB_URL');
        return {
          uri: mongoUrl,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(models),
  ],
  providers: [...repositories],
  exports: [...repositories],
})
export class MongoDbModule {}
