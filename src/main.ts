import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
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
  
  var whitelist = ['https://inso.ai', 'http://inso.ai', 'http://localhost:3001', /\.inso.ai$/, 'http://inso-staging.s3-website-us-east-1.amazonaws.com'];
  app.enableCors();

  app.use(helmet());
  
  await app.listen(process.env.PORT);
}
bootstrap();
