import { isArray } from 'class-validator';
import { Model } from 'sequelize-typescript';
import { NotFoundError } from '../../utils/errors';
import { Job, JobResponse } from '../../utils/job';
import config from '../../../config';

type Constructor<T> = new (...args: any[]) => T;
export type ModelType<T extends Model<T>> = Constructor<T> & typeof Model;

export abstract class DatabaseService {
  constructor(private readonly model: ModelType<any>) {}

  /**
   * Create a new record using model's create method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async createRecord(job: Job): Promise<JobResponse> {
    try {
      if (!job.body)
        return { error: 'Error calling createRecord - body is missing' };
      if (!!job.owner && !!job.owner.id) {
        job.body.created_by = job.owner.id;
        job.body.updated_by = job.owner.id;
      }
      const fields = job.options.fields || undefined;
      const transaction = job.options.transaction || undefined;
      const data = await this.model.create(job.body, { fields, transaction });
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Create bulk records using model's bulkCreate method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async createBulkRecords(job: Job): Promise<JobResponse> {
    try {
      if (!job.records || !isArray(job.records) || !job.records.length)
        return {
          error: 'Error calling createBulkRecord - records are missing',
        };
      if (!!job.owner && !!job.owner.id) {
        job.records = job.records.map((x) => ({
          ...x,
          created_by: job.owner.id,
          updated_by: job.owner.id,
        }));
      }
      const fields = job.options.fields || undefined;
      const transaction = job.options.transaction || undefined;
      const data = await this.model.bulkCreate(job.records, {
        fields,
        transaction,
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Update a record using model's findByPk and save methods
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async updateRecord(job: Job): Promise<JobResponse> {
    try {
      if (!job.id)
        return { error: 'Error calling updateRecord - id is missing' };
      if (!job.body)
        return { error: 'Error calling updateRecord - body is missing' };
      if (!!job.owner && !!job.owner.id) {
        job.body.updated_by = job.owner.id;
      }
      const where = job.options.where || {};
      const data = await this.model.findOne({
        where: { ...where, id: job.id },
      });
      if (data === null) throw new NotFoundError('Record not found');
      const previousData = JSON.parse(JSON.stringify(data));
      for (const prop in job.body) {
        data[prop] = job.body[prop];
      }
      const fields = job.options.fields || undefined;
      const transaction = job.options.transaction || undefined;
      await data.save({ fields, transaction });
      return { data, previousData };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Find and update a record using model's findOne and save methods
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async findAndUpdateRecord(job: Job): Promise<JobResponse> {
    try {
      if (!job.options?.where)
        return {
          error: 'Error calling findAndUpdateRecord - options.where is missing',
        };
      if (!job.body)
        return { error: 'Error calling findAndUpdateRecord - body is missing' };
      if (!!job.owner && !!job.owner.id) {
        job.body.updated_by = job.owner.id;
      }
      const where = job.options.where || undefined;
      const fields = job.options.fields || undefined;
      const transaction = job.options.transaction || undefined;
      const data = await this.model.findOne({ where });
      if (data === null) throw new NotFoundError('Record not found');
      const previousData = JSON.parse(JSON.stringify(data));
      for (const prop in job.body) {
        data[prop] = job.body[prop];
      }
      await data.save({ fields, transaction });
      return { data, previousData };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Update bulk records using model's update methods
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async updateBulkRecords(job: Job): Promise<JobResponse> {
    try {
      if (!job.body)
        return { error: 'Error calling updateBulkRecords - body is missing' };
      if (!!job.owner && !!job.owner.id) {
        job.body.updated_by = job.owner.id;
      }
      const where = job.options.where || undefined;
      const fields = job.options.fields || undefined;
      const transaction = job.options.transaction || undefined;
      const data = await this.model.update(job.body, {
        where,
        fields,
        transaction,
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Get paginated results using model's findAndCountAll method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async getAllRecords(job: Job): Promise<JobResponse> {
    try {
      const offset = job.options.offset ? +job.options.offset : 0;
      const limit = job.options.limit
        ? +job.options.limit === -1
          ? 1000
          : +job.options.limit
        : config().paginationLimit;
      const where = job.options.where || undefined;
      const attributes = job.options.attributes || undefined;
      const include = job.options.include || undefined;
      const order = job.options.sort || undefined;
      const group = job.options.group || undefined;
      const having = job.options.having || undefined;
      const raw = job.options.raw || undefined;
      const distinct = job.options.distinct || undefined;
      const data = await this.model.findAndCountAll({
        offset,
        limit,
        where,
        attributes,
        include,
        order,
        group,
        having,
        paranoid: !job.options?.withDeleted,
        raw,
        distinct,
      });
      return { data: data.rows, offset, limit, count: data.count };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Get total count of record using model's findAndCountAll method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async countAllRecords(job: Job): Promise<JobResponse> {
    try {
      const where = job.options.where || undefined;
      const attributes = job.options.attributes || undefined;
      const include = job.options.include || undefined;
      const distinct = job.options.distinct || undefined;
      const data = await this.model.count({
        where,
        attributes,
        include,
        paranoid: !job.options?.withDeleted,
        distinct,
      });
      return { count: data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Find a record using model's findByPk method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async findRecordById(job: Job): Promise<JobResponse> {
    try {
      if (!job.id)
        return { error: 'Error calling findRecordById - id is missing' };
      const where = job.options.where || {};
      const attributes = job.options.attributes || undefined;
      const include = job.options.include || undefined;
      const transaction = job.options.transaction || undefined;
      const lock = job.options.lock || undefined;
      const raw = job.options.raw || undefined;
      const data = await this.model.findOne({
        where: { ...where, id: job.id },
        attributes,
        include,
        paranoid: !job.options?.withDeleted,
        transaction,
        lock,
        raw,
      });
      if (data === null && !job.options?.allowEmpty)
        throw new NotFoundError('Record not found');
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Find a record using model's findOne method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async findOneRecord(job: Job): Promise<JobResponse> {
    try {
      if (!job.options.where)
        return {
          error: 'Error calling findOneRecord - options.where is missing',
        };
      const where = job.options.where || undefined;
      const attributes = job.options.attributes || undefined;
      const include = job.options.include || undefined;
      const order = job.options.sort || undefined;
      const group = job.options.group || undefined;
      const having = job.options.having || undefined;
      const transaction = job.options.transaction || undefined;
      const lock = job.options.lock || undefined;
      const raw = job.options.raw || undefined;
      const data = await this.model.findOne({
        where,
        attributes,
        include,
        order,
        group,
        having,
        paranoid: !job.options?.withDeleted,
        transaction,
        lock,
        raw,
      });
      if (data === null && !job.options?.allowEmpty)
        throw new NotFoundError('Record not found');
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Delete a record using model's destroy method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async deleteRecord(job: Job): Promise<JobResponse> {
    try {
      if (!job.id)
        return { error: 'Error calling deleteRecord - id is missing' };
      const where = job.options.where || {};
      const data = await this.model.findOne({
        where: { ...where, id: job.id },
        paranoid: !job.options.hardDelete,
      });
      if (data === null) throw new NotFoundError('Record not found');
      if (!!job.owner && !!job.owner.id) {
        data.updated_by = job.owner.id;
      }
      const transaction = job.options.transaction || undefined;
      await data.destroy({
        force: !!job.options?.hardDelete,
        transaction,
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Find and delete a record using model's findOne and destroy methods
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async findAndDeleteRecord(job: Job): Promise<JobResponse> {
    try {
      if (!job.options?.where)
        return {
          error: 'Error calling findAndDeleteRecord - options.where is missing',
        };
      const where = job.options.where || undefined;
      const data = await this.model.findOne({
        where,
        paranoid: !job.options.hardDelete,
      });
      if (data === null) throw new NotFoundError('Record not found');
      if (!!job.owner && !!job.owner.id) {
        data.updated_by = job.owner.id;
      }
      const transaction = job.options.transaction || undefined;
      await data.destroy({
        force: !!job.options?.hardDelete,
        transaction,
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Delete bulk records using model's destroy methods
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async deleteBulkRecords(job: Job): Promise<JobResponse> {
    try {
      const where = job.options.where || undefined;
      const transaction = job.options.transaction || undefined;
      const data = await this.model.destroy({
        where,
        force: !!job.options?.hardDelete,
        truncate: !!job.options?.truncate,
        transaction,
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Restore a soft deleted record using model's restore method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async restoreRecord(job: Job): Promise<JobResponse> {
    try {
      if (!job.id)
        return { error: 'Error calling restoreRecord - id is missing' };
      const data = await this.model.findByPk(job.id, {
        paranoid: false,
      });
      if (data === null) throw new NotFoundError('Record not found');
      if (!!job.owner && !!job.owner.id) {
        data.updated_by = job.owner.id;
      }
      const transaction = job.options.transaction || undefined;
      await data.restore({ transaction });
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Find a record or create if not exists
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async findOrCreate(job: Job): Promise<JobResponse> {
    try {
      if (!job.body)
        return { error: 'Error calling findOrCreate - body is missing' };
      if (!job.options?.where)
        return {
          error: 'Error calling findOrCreate - options.where is missing',
        };
      const where = job.options.where || undefined;
      const attributes = job.options.attributes || undefined;
      const include = job.options.include || undefined;
      if (!!job.owner && !!job.owner.id) {
        job.body.created_by = job.owner.id;
        job.body.updated_by = job.owner.id;
      }
      const fields = job.options.fields || undefined;
      const transaction = job.options.transaction || undefined;
      const lock = job.options.lock || undefined;
      const [data, created] = await this.model.findCreateFind({
        defaults: job.body,
        where,
        attributes,
        include,
        paranoid: !job.options?.withDeleted,
        fields,
        transaction,
        lock,
      });
      return { data, created };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Update if exists or create a new record
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async createOrUpdate(job: Job): Promise<JobResponse> {
    try {
      if (!job.body)
        return { error: 'Error calling createOrUpdate - body is missing' };
      if (!job.options?.where)
        return {
          error: 'Error calling createOrUpdate - options.where is missing',
        };
      const where = job.options.where || undefined;
      const attributes = job.options.attributes || undefined;
      const include = job.options.include || undefined;
      const fields = job.options.fields || undefined;
      const transaction = job.options.transaction || undefined;
      if (!!job.owner && !!job.owner.id) {
        job.body.created_by = job.owner.id;
        job.body.updated_by = job.owner.id;
      }
      const [data, created] = await this.model.findOrBuild({
        where,
        attributes,
        include,
        paranoid: !job.options?.withDeleted,
      });
      for (const prop in job.body) {
        data[prop] = job.body[prop];
      }
      await data.save({ fields, transaction });
      return { data, created };
    } catch (error) {
      return { error };
    }
  }

  /**
   * model's findAll method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async findAllCustom(job: Job): Promise<JobResponse> {
    try {
      const data = await this.model.findAll(job.options);
      return { data };
    } catch (error) {
      return { error };
    }
  }

  /**
   * model's findOne method
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async findOneCustom(job: Job): Promise<JobResponse> {
    try {
      const data = await this.model.findOne(job.options);
      return { data };
    } catch (error) {
      return { error };
    }
  }
}
