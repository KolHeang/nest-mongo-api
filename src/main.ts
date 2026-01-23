import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  app.useGlobalFilters(
    new MongoExceptionFilter(),
    new HttpExceptionFilter(),
  );


  app.setGlobalPrefix('api');

  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
