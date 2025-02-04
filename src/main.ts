import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // register all plugins and extension
  // app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionsFilter());
  // app.useGlobalInterceptors(new TransformDateInterceptor());
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      // whitelist: true,
    }),
  );
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  logger.log(`Running in ${configService.get('ENV')} mode`);
  await app.listen(configService.get('port'));
}
bootstrap();
