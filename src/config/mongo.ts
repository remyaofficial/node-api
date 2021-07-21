import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export default registerAs(
  'mongo',
  (): MongooseModuleOptions => ({
    uri: process.env.MONGO_URI || 'mongodb://localhost/nest',
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }),
);
