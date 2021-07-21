import { Transaction } from 'sequelize';
import { OwnerDto } from '../../decorators/owner.decorator';
import config from '../../config';

export interface JobOption {
  /**
   * search key for query
   */
  search?: string;
  /**
   * Where object for query
   */
  where?: any;
  /**
   * array of fields to select
   */
  select?: string[];
  /**
   * attributes or projection object for query
   */
  attributes?: any;
  /**
   * array of association to include
   */
  populate?: string[];
  /**
   * include option for sequelize
   */
  include?: any[];
  /**
   * sort or order object for query
   */
  sort?: any;
  /**
   * group object for query
   */
  group?: any;
  /**
   * having conditions object for query
   */
  having?: any;
  /**
   * include deleted records also in result
   */
  withDeleted?: boolean;
  /**
   * allow empty result, else trigger error
   */
  allowEmpty?: boolean;
  /**
   * hard delete record, else delete_at field will be set
   */
  hardDelete?: boolean;
  /**
   * truncate table
   */
  truncate?: boolean;
  /**
   * Offset for pagination
   */
  offset?: number;
  /**
   * Limit for pagination
   */
  limit?: number;
  /**
   * Array of fields to create/update
   */
  fields?: string[];
  /**
   * transaction identifier
   */
  transaction?: Transaction;
  /**
   * transaction lock
   */
  lock?: any;
  /**
   * raw result
   */
  raw?: boolean;
  /**
   * distinct result
   */
  distinct?: boolean;
  /**
   * Other options
   */
  [key: string]: any;
}

export interface JobResponse {
  /**
   * Error object or string
   */
  error?: any;
  /**
   * Response data
   */
  data?: any;
  /**
   * Response success or error message
   */
  message?: string;
  /**
   * Is created flag
   */
  created?: boolean;
  /**
   * Previous data object
   */
  previousData?: any;
  /**
   * Offset for pagination
   */
  offset?: number;
  /**
   * Limit for pagination
   */
  limit?: number;
  /**
   * Total available records count
   */
  count?: number;
}

export class Job {
  /**
   * source app
   */
  app?: string;
  /**
   * job unique id
   */
  uid?: string;
  /**
   * user or onwer object on behave this job is running
   */
  owner: OwnerDto;
  /**
   * action performing using this job
   */
  action?: string;
  /**
   * primary key of the model
   */
  id?: number | string;
  /**
   * body object used for create or update
   */
  body?: {
    [key: string]: any;
  };
  /**
   * files object used for upload
   */
  files?: any;
  /**
   * array of records used for bulk create
   */
  records?: {
    [key: string]: any;
  }[];
  /**
   * options like where, populate, select, etc
   */
  options?: JobOption;
  /**
   * additional parameters used in services
   */
  payload?: any;
  /**
   * Job response object
   */
  response?: JobResponse;
  /**
   * Status of the job
   *
   * @default Pending
   */
  status: 'Pending' | 'Completed' | 'Errored';

  constructor(job) {
    job = job || {};
    this.app = job.app || config().appId;
    this.owner = job.owner || {
      id: 0,
    };
    this.uid = job.uid || null;
    this.action = job.action || null;
    this.id = job.id || null;
    this.body = job.body || null;
    this.files = job.files || {};
    this.records = job.records || [];
    this.options = job.options || {};
    this.payload = job.payload || {};
    this.response = job.response || {};
    this.status = job.status || 'Pending';
  }

  done(res: JobResponse): void {
    this.response = res;
    this.status = !!this.response.error ? 'Errored' : 'Completed';
  }
}
