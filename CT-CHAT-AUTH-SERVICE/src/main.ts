import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const url: string = process.env.RABBITMQ_URL;
  const AUTH_QUEUE = process.env.AUTH_QUEUE;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue: AUTH_QUEUE,
      queueOptions: {
        durable: false,
        prefetch: 1,
      },
    },
  });

  await app.startAllMicroservices();

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');

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
