import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { environment } from '@src/environment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(environment.app.prefix);

  const config = new DocumentBuilder()
    .setTitle('UniShop Telegram Bot Api')
    .setDescription('The API description of the Telegram bot services')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(environment.app.port);
}
bootstrap();
