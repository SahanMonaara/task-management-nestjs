import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const config = new DocumentBuilder()
    .setTitle('Tasks example')
    .setDescription('The tasks API description')
    .setVersion('1.0')
    .addTag('tasks')
    .build();

  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, config);
  const port = 3000;
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(port);

  logger.log(`Application listening on port: ${port}`);
  SwaggerModule.setup('api', app, document);
}
bootstrap();
