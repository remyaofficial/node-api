import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ModelService } from '../../core/modules/database/model.service';
import { ModelType } from '../../core/modules/database/database.service';
import { Job, JobResponse } from '../../core/utils/job';
import { User } from './entities/user.entity';
import { ValidationError } from '../../core/utils/errors';
import { compareHash, generateHash } from '../../core/utils/helpers';

@Injectable()
export class UserService extends ModelService {
  /**
   * searchFields
   * @property array of fields to include in search
   */
  searchFields: string[] = ['full_name', 'email'];

  constructor(@InjectModel(User) model: ModelType<User>) {
    super(model);
  }

  /**
   * doBeforeWrite
   * @function function will execute before create and update function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  async doBeforeWrite(job: Job): Promise<void> {
    await super.doBeforeWrite(job);
    /* Restrict email and password update */
    if (job.action === 'update') {
      delete job.body?.email;
      delete job.body?.password;
    }
    /* Validate if email already exists */
    if (job.action === 'create') {
      const { error, data } = await this.findOneRecord(
        new Job({
          options: {
            where: { email: job.body?.email },
            allowEmpty: true,
          },
        }),
      );
      if (!!error) {
        job.response = { error };
      } else if (!!data) {
        job.response = { error: new ValidationError('Email already exist') };
      }
    }
  }

  /**
   * changePassword
   * @function function will execute before create and update function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  async changePassword(job: Job): Promise<JobResponse> {
    const { owner, body } = job;
    const userResult = await this.findRecordById(
      new Job({
        owner,
        action: 'findById',
        id: owner.id,
        options: {
          attributes: { include: ['password'] },
        },
      }),
    );
    if (!!userResult.error) return userResult;
    const user = userResult.data;
    if (!(await compareHash(body.old_password, user.password))) {
      return { error: 'Invalid password' };
    }
    try {
      user.password = await generateHash(body.password);
      await user.save();
      return { error: false };
    } catch (error) {
      return { error };
    }
  }
}
