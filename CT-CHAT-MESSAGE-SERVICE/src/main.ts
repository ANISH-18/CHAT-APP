import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ClusterService } from './cluster.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const url: string = process.env.RABBITMQ_URL;
  const MESSAGE_QUEUE = process.env.MESSAGE_QUEUE;

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue: MESSAGE_QUEUE,
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Message Service')
    .setDescription('Message Service API')
    .setVersion('1.0')
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

// ClusterService.clusterize(bootstrap);
