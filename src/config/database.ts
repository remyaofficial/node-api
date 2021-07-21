// import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { isPrimaryInstance } from '../core/utils/helpers';

// const logger: Logger = new Logger('QueryLog');

export default registerAs(
  'database',
  (): SequelizeModuleOptions => ({
    dialect: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || `nest`,
    autoLoadModels: true,
    synchronize: isPrimaryInstance() && true, // avoid multiple sync while using pm2 cluster
    sync: {
      alter: process.env.DATABASE_ALTER_SYNC === 'Y',
    },
    logging: (/* sql: string */) => false, //logger.log(sql),
  }),
);
