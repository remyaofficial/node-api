import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const seeder = app.select(SeederModule).get(SeederService);
    await seeder.seed();
    await app.close();
    process.exit(0);
  } catch (error) {}
}
bootstrap();
