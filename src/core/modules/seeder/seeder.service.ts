import { Injectable, Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SeedReference } from './seeder.dto';
import seeds from '../../../seeds';

@Injectable()
export class SeederService {
  private logger: Logger = new Logger('Seeder');
  constructor(private sequelize: Sequelize) {}

  async seed() {
    this.logger.log('Started');
    for (let index = 0; index < seeds.length; index++) {
      const seed = seeds[index];
      this.logger.log(`Model: ${seed.model}`);
      if (seed.action === 'never') {
        this.logger.log(`Ignoring - ${seed.model} not required`);
        continue;
      } else if (seed.action === 'once') {
        try {
          const count = await this.sequelize.models[seed.model].count();
          if (count > 0) {
            this.logger.log(`Ignoring - ${seed.model} already exist`);
            continue;
          }
        } catch (error) {
          this.logger.log(
            `Failed - count ${seed.model} ${error.message || error}`,
          );
          continue;
        }
      } else {
        try {
          await this.sequelize.models[seed.model].destroy({ truncate: true });
        } catch (error) {
          this.logger.log(
            `Failed - empty ${seed.model} ${error.message || error}`,
          );
          continue;
        }
      }
      this.logger.debug(`Seeding ${seed.model}`);
      for (let index = 0; index < seed.data.length; index++) {
        const body = seed.data[index];
        try {
          for (const key in body) {
            if (Object.prototype.hasOwnProperty.call(body, key)) {
              const value = body[key];
              if (value instanceof SeedReference) {
                const parent = await this.sequelize.models[value.model].findOne(
                  { where: value.where },
                );
                if (!!parent) body[key] = parent.getDataValue('id');
                else body[key] = null;
              }
            }
          }
          await this.sequelize.models[seed.model].create(body);
        } catch (error) {
          this.logger.error(
            `Failed - seed ${seed.model} ${error.message || error}`,
          );
          this.logger.debug(body);
        }
      }
      this.logger.debug(`Seeded ${seed.model}`);
    }
    this.logger.log('Completed');
  }
}
