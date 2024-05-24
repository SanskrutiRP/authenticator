import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'firebase/auth';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import * as admin from 'firebase-admin';
import * as serviceAccount from './service-key.json';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // setup swagger configuration/ structure base document that conforms to the OpenAPI Specification
  const config = new DocumentBuilder()
    .setTitle('Voosh')
    .setDescription('Voosh Authentication API documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  //  create a full document (with all HTTP routes defined)
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });

  console.log('App started: 3000');

  await app.listen(3005);
}
bootstrap();
