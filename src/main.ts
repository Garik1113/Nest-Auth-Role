require('dotenv');
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.HOST,
        port: Number(process.env.PORT),
      },
    },
  );
  await app.listen();
  console.log('Auth microservice started on port', Number(process.env.PORT));
}
bootstrap();
