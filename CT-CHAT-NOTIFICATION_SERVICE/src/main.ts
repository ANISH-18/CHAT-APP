import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');
  const RMQ_URL: string = config.get<string>('RABBITMQ_URL');
  const NOTIFICATION_QUEUE: string = config.get<string>('NOTIFICATION_QUEUE');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [RMQ_URL],
      queue: NOTIFICATION_QUEUE,
      queueOptions: {
        durable: false,
        prefetchCount: 1,
      },
    },
  });

  await app.startAllMicroservices();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();
  app.setGlobalPrefix('/api/v1');

  await app.listen(port, () => {
    Logger.log(`started listening on prot ${port}`);
  });
}

bootstrap();
