import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  console.log(process.env.MONGO_CONNECTION_STRING);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  
  const config = new DocumentBuilder()
    .setTitle('Inso API')
    .setDescription('API for Inso system')
    .setVersion('0.0')
    .addTag('Routes')
    .build();
    
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true
  });
  SwaggerModule.setup('api', app, document);
  
  app.use(helmet());
  
  await app.listen(3000);
}
bootstrap();
