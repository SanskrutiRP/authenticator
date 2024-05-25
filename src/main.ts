import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'firebase/auth';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import * as admin from 'firebase-admin';
import * as serviceAccount from './service-key.json';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Authenticator API')
    .setDescription('API documentation for the Authenticator application')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    ) 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  app.enableCors();
  app.use(json({ limit: '150mb' }));
  app.use(urlencoded({ extended: true, limit: '150mb' }));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });

  console.log('App started: 3000');

  await app.listen(3005);
}
bootstrap();
