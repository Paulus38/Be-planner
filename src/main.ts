import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionLoggingFilter } from './common/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionLoggingFilter());
    app.enableCors({
      origin: process.env.FRONTEND_URL || '*',
      credentials: true,
    });

    const port = parseInt(process.env.PORT || '3001', 10);
    await app.listen(port);
    logger.log(`Backend server running on port ${port}`);
  } catch (error) {
    logger.error('Backend startup failed', error instanceof Error ? error.stack : String(error));
    process.exitCode = 1;
  }
}

process.on('unhandledRejection', (reason) => {
  Logger.error(
    `Unhandled promise rejection: ${reason instanceof Error ? reason.message : String(reason)}`,
    reason instanceof Error ? reason.stack : undefined,
    'Process',
  );
});

process.on('uncaughtException', (error) => {
  Logger.error(error.message, error.stack, 'Process');
  process.exitCode = 1;
});

void bootstrap();
