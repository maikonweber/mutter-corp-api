import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "https://www.muttercorp.com.br", // Allow all origins
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
    },
  });

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Mutter Corp API')
    .setDescription('This is Mutter Corporation to access all information')
    .setVersion('1.0')
    .addTag('')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

bootstrap();
