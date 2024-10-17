import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import serverlessExpress from '@vendia/serverless-express';
import { AppModule } from 'src/app.module';
import { TransformInterceptor } from 'src/transform.interceptor';
import { Handler, Context, Callback } from 'aws-lambda';

let cachedServer: Handler;

async function bootstrap() {
  const config = new DocumentBuilder()
    .setTitle('Tasks example')
    .setDescription('The tasks API description')
    .setVersion('1.0')
    .addTag('tasks')
    .build();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const document = SwaggerModule.createDocument(app, config);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.init();
  SwaggerModule.setup('api', app, document);

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  cachedServer = cachedServer ?? (await bootstrap());
  return cachedServer(event, context, callback);
};
