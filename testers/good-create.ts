import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { Job } from 'src/core/utils/job';
import { GoodModule } from 'src/modules/good/good.module';
import { GoodService } from 'src/modules/good/good.service';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const goodService = app.select(GoodModule).get(GoodService);
    const response = await goodService.create(
      new Job({
        action: 'create',
        body: {
          name: 'test good',
          price: 25.99,
        },
      }),
    );
    console.log(response);
    await app.close();
    process.exit(0);
  } catch (error) {}
}
bootstrap();
