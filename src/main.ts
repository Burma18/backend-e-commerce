import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { environment } from '@src/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(environment.app.prefix);

  await app.listen(environment.app.port);
}
bootstrap();
