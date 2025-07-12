import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';

// Simple logger for now
const createLogger = (context: string) => ({
  info: (message: string, meta?: any) => console.log(`[${context}] ${message}`, meta || ''),
  error: (message: string, meta?: any) => console.error(`[${context}] ${message}`, meta || ''),
  warn: (message: string, meta?: any) => console.warn(`[${context}] ${message}`, meta || ''),
});

const logger = createLogger('AuthAPI');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('JustRally Auth API')
      .setDescription('Authentication API for JustRally mobile application')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.info(`Auth API running on port ${port}`, {
    environment: process.env.NODE_ENV,
    port,
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to start application', { error: error.message });
  process.exit(1);
});