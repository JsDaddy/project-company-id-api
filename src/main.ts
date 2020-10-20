import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('company-id')
    .setDescription('The company-id API')
    .setVersion('1.0')
    .addTag('company-id')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  const port: string = process.env.PORT ?? '8090';
  console.log(port);
  await app.listen(port);
}
bootstrap();
