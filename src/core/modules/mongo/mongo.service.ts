import { isArray } from 'class-validator';
import { Model } from 'mongoose';
import { NotFoundError } from '../../utils/errors';
import { Job, JobResponse } from '../../utils/job';
import config from '../../../config';

export abstract class MongoService {
  constructor(private model: Model<any>) {}

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
      const data = new this.model(job.body);
      await data.save();
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
      const data = await this.model.create(job.records);
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
        ...where,
        _id: job.id,
        deleted_at: null,
      });
      const previousData = JSON.parse(JSON.stringify(data));
      for (const prop in job.body) {
        data[prop] = job.body[prop];
      }
      await data.save();
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
      const data = await this.model.findOne({ ...where, deleted_at: null });
      if (data === null) throw new NotFoundError('Record not found');
      const previousData = JSON.parse(JSON.stringify(data));
      for (const prop in job.body) {
        data[prop] = job.body[prop];
      }
      await data.save();
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
      const data = await this.model.updateMany(
        { ...where, deleted_at: null },
        job.body,
      );
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
      const where = job.options.where || {};
      const projection = job.options.attributes || null;
      if (!job.options.withDeleted) {
        where.deleted_at = null;
      }
      const data = await Promise.all([
        this.model.find(where, projection, {
          skip: offset,
          limit,
        }),
        this.model.countDocuments(where),
      ]);
      return { data: data[0], offset, limit, count: data[1] };
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
      const where = job.options.where || {};
      if (!job.options.withDeleted) {
        where.deleted_at = null;
      }
      const data = await this.model.countDocuments(where);
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
      const projection = job.options.attributes || null;
      if (!job.options.withDeleted) {
        where.deleted_at = null;
      }
      const data = await this.model.findOne(
        { ...where, _id: job.id },
        projection,
      );
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
      const where = job.options.where || {};
      const projection = job.options.attributes || null;
      if (!job.options.withDeleted) {
        where.deleted_at = null;
      }
      const data = await this.model.findOne(where, projection);
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
      if (!job.options.hardDelete) {
        where.deleted_at = null;
      }
      const data = await this.model.findOne({ ...where, _id: job.id });
      if (data === null) throw new NotFoundError('Record not found');
      if (!!job.options.hardDelete) {
        await data.remove();
      } else {
        if (!!job.owner && !!job.owner.id) {
          data.updated_by = job.owner.id;
        }
        data.deleted_at = Date.now();
        await data.save();
      }
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
      const where = job.options.where || {};
      if (!job.options.hardDelete) {
        where.deleted_at = null;
      }
      const data = await this.model.findOne(where);
      if (data === null) throw new NotFoundError('Record not found');
      if (!!job.options.hardDelete) {
        await data.remove();
      } else {
        if (!!job.owner && !!job.owner.id) {
          data.updated_by = job.owner.id;
        }
        data.deleted_at = Date.now();
        await data.save();
      }
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
      const where = job.options.where || {};
      if (!!job.options.hardDelete) {
        const data = await this.model.deleteMany(where);
        return { data };
      } else {
        const body: any = {
          deleted_at: Date.now(),
        };
        if (!!job.owner && !!job.owner.id) {
          body.updated_by = job.owner.id;
        }
        const data = await this.model.updateMany(where, body);
        return { data };
      }
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
      const data = await this.model.findById(job.id);
      if (data === null) throw new NotFoundError('Record not found');
      if (!!job.owner && !!job.owner.id) {
        data.updated_by = job.owner.id;
      }
      data.deleted_at = null;
      await data.save();
      return { data };
    } catch (error) {
      return { error };
    }
  }
}
