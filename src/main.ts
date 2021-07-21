import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions } from '@nestjs/microservices';
import * as compression from 'compression';
import * as session from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { join } from 'path';
import { AppModule } from './app.module';
import docConfig from './config/swagger';
import { SeederModule } from './core/modules/seeder/seeder.module';
import { SeederService } from './core/modules/seeder/seeder.service';
import { initAdapters } from './app.gateway';
import { isPrimaryInstance } from './core/utils/helpers';

async function bootstrap() {
  /* App init */
  const env = process.env.NODE_ENV || 'development';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    /* Show only errors and warning in production env  */
    logger: env === 'production' ? ['error', 'warn'] : true,
  });
  /* Loading config */
  const config = app.get(ConfigService);
  /* Morgan logger in non-production env */
  if (env !== 'production') app.use(morgan('tiny'));
  /* Swagger document */
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('/api-docs', app, document);
  /* Validation */
  app.useGlobalPipes(new ValidationPipe());
  /* HTTP cookie */
  app.use(cookieParser());
  /* HTTP sessions */
  app.set('trust proxy', 1);
  const RedisStore = connectRedis(session);
  app.use(
    session({
      store: new RedisStore({
        client: redis.createClient(config.get('redis')),
      }),
      secret: config.get('sessionSecret'),
      resave: false,
      saveUninitialized: false,
    }),
  );
  /* Helmet */
  app.use(helmet());
  /* CORS */
  app.enableCors();
  /* Compression */
  app.use(compression());
  /* MVC setup */
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');
  if (isPrimaryInstance()) {
    /* Micro service setup */
    app.connectMicroservice<MicroserviceOptions>(config.get('ms'));
    await app.startAllMicroservicesAsync();
    /* Seeding */
    const seeder = app.select(SeederModule).get(SeederService);
    await seeder.seed();
    /* Init socket */
    if (!!config.get('useSocketIO')) {
      initAdapters(app);
    }
  }
  /* Starting app */
  const port = config.get('port');
  await app.listen(port);
}
bootstrap();
