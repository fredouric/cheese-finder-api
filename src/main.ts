import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port: string | number = process.env.PORT || 8080; // Use 3000 as a default value if PORT is not defined

await app.listen(port);
}
bootstrap();
