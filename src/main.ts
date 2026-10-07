import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import "reflect-metadata";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");

  //Dışarıdan gelen veriyi @Body ile almadan önce kontrol eder.Dto ya uymayan verileri reddeder.
  //whitelist: true -> DTO'da olmayan extra verileri yok sayar (Security).
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
