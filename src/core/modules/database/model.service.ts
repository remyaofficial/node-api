import { Op } from 'sequelize';
import { DatabaseService, ModelType } from './database.service';
import { Job, JobResponse } from '../../utils/job';
import { convertPopulate, convertWhere } from '../../utils/helpers';
import { isObject, isString } from 'class-validator';

export abstract class ModelService extends DatabaseService {
  /**
   * searchFields
   * @property array of fields to include in search
   */
  searchFields: string[] = [];

  /**
   * searchPopulate
   * @property array of associations to include for search
   */
  searchPopulate: string[] = [];

  constructor(model: ModelType<any>) {
    super(model);
  }

  /**
   * convertPayload
   * @function function will execute before findAll, findById and findOne function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  async convertPayload(job: Job): Promise<void> {
    const options = job.options;
    const select = options.select || [];
    const where = convertWhere(options.where || {});
    const attributes = select.map((x) => x.replace(/[^a-zA-Z0-9_]/g, ''));
    /* add populate to sequelize include option */
    const include = convertPopulate(options.populate || []);
    /* Search from searchFields, if options.search key is set */
    where[Op.and] = where[Op.and] || [];
    if (!!options.search && !!this.searchFields.length) {
      const whereOR = [];
      for (let index = 0; index < this.searchFields.length; index++) {
        const field = this.searchFields[index];
        whereOR.push({ [field]: { [Op.substring]: options.search } });
      }
      where[Op.and].push({ [Op.or]: whereOR });
      if (!!this.searchPopulate.length) {
        for (let index = 0; index < this.searchPopulate.length; index++) {
          const association = this.searchPopulate[index];
          if (isObject(association)) {
            include.push(association);
          } else if (isString(association)) {
            const associationIndex = include.findIndex(
              (x) => (x?.association || x) === association,
            );
            if (associationIndex === -1) {
              include.push({ association, include: [] });
            }
          }
        }
      }
    }
    job.options.where = where;
    job.options.include = include;
    job.options.attributes = attributes.length ? attributes : undefined;
  }

  /**
   * doBeforeRead
   * @function function will execute before findAll, findById and findOne function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  async doBeforeRead(job: Job): Promise<void> {
    job.response.error = false;
  }

  /**
   * doBeforeWrite
   * @function function will execute before create and update function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  async doBeforeWrite(job: Job): Promise<void> {
    job.response.error = false;
  }

  /**
   * doBeforeDelete
   * @function function will execute before delete function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  async doBeforeDelete(job: Job): Promise<void> {
    job.response.error = false;
  }

  /**
   * findAll
   * @function search and get records with total count and pagination
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async findAll(job: Job): Promise<JobResponse> {
    try {
      await this.convertPayload(job);
      await this.doBeforeRead(job);
      if (!!job.response.error) return job.response;
      job.response = await this.getAllRecords(job);
      if (!!job.response.error) return job.response;
      await this.doAfterRead(job);
      return job.response;
    } catch (error) {
      return { error };
    }
  }

  /**
   * getCount
   * @function search and get records with total count and pagination
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async getCount(job: Job): Promise<JobResponse> {
    try {
      await this.convertPayload(job);
      await this.doBeforeRead(job);
      if (!!job.response.error) return job.response;
      job.response = await this.countAllRecords(job);
      if (!!job.response.error) return job.response;
      await this.doAfterRead(job);
      return job.response;
    } catch (error) {
      return { error };
    }
  }

  /**
   * findById
   * @function get a record using primary key
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async findById(job: Job): Promise<JobResponse> {
    try {
      await this.convertPayload(job);
      await this.doBeforeRead(job);
      if (!!job.response.error) return job.response;
      job.response = await this.findRecordById(job);
      if (!!job.response.error) return job.response;
      await this.doAfterRead(job);
      return job.response;
    } catch (error) {
      return { error };
    }
  }

  /**
   * findOne
   * @function search and find a record
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async findOne(job: Job): Promise<JobResponse> {
    try {
      await this.convertPayload(job);
      await this.doBeforeRead(job);
      if (!!job.response.error) return job.response;
      job.response = await this.findOneRecord(job);
      if (!!job.response.error) return job.response;
      await this.doAfterRead(job);
      return job.response;
    } catch (error) {
      return { error };
    }
  }

  /**
   * create
   * @function create a new record
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async create(job: Job): Promise<JobResponse> {
    try {
      await this.doBeforeWrite(job);
      if (!!job.response.error) return job.response;
      job.response = await this.createRecord(job);
      if (!!job.response.error) return job.response;
      await this.doAfterWrite(job);
      return job.response;
    } catch (error) {
      return { error };
    }
  }

  /**
   * update
   * @function update a record using primary key
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async update(job: Job): Promise<JobResponse> {
    try {
      await this.doBeforeWrite(job);
      if (!!job.response.error) return job.response;
      job.response = await this.updateRecord(job);
      if (!!job.response.error) return job.response;
      await this.doAfterWrite(job);
      return job.response;
    } catch (error) {
      return { error };
    }
  }

  /**
   * delete
   * @function delete a record using primary key
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} job response object
   */
  async delete(job: Job): Promise<JobResponse> {
    try {
      await this.doBeforeDelete(job);
      if (!!job.response.error) return job.response;
      job.response = await this.deleteRecord(job);
      if (!!job.response.error) return job.response;
      await this.doAfterDelete(job);
      return job.response;
    } catch (error) {
      return { error };
    }
  }

  /**
   * doAfterRead
   * @function function will execute after findAll, findById and findOne function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  async doAfterRead(job: Job): Promise<void> {
    job.status = !!job.response.error ? 'Errored' : 'Completed';
  }

  /**
   * doAfterWrite
   * @function function will execute after create and update function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  async doAfterWrite(job: Job): Promise<void> {
    job.status = !!job.response.error ? 'Errored' : 'Completed';
  }

  /**
   * doAfterDelete
   * @function function will execute after delete function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {void}
   */
  async doAfterDelete(job: Job): Promise<void> {
    job.status = !!job.response.error ? 'Errored' : 'Completed';
  }
}
