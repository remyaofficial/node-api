import { DocumentBuilder } from '@nestjs/swagger';

export default new DocumentBuilder()
  .setTitle('NewAgeSmb Core Framework')
  .setDescription('Newagesmb core framework API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
