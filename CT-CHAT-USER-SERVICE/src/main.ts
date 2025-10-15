import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');
  const USER_QUEUE: string = config.get<string>('USER_QUEUE');

  const URL: string = config.get<string>('RABBITMQ_URL');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [URL],
      queue: USER_QUEUE,
      queueOptions: {
        durable: false,
        prefetch: 2,
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

  app.useGlobalFilters();

  //SWAGGER
  const swaggerConfig = new DocumentBuilder()
    .setTitle('User Service')
    .setDescription('User Microservice API Documentation')
    .setVersion('1.0')
    .addTag('User')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  app.setGlobalPrefix('/api/v1');

  await app.listen(port, () => {
    Logger.log(`started listening on prot ${port}`);
  });
}

bootstrap();
