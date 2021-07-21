import { Injectable } from '@nestjs/common';
import { FirebaseMessagingService } from '@aginix/nestjs-firebase-admin';
import { Job, JobResponse } from '../../../utils/job';

@Injectable()
export class FirebaseNotificationService {
  constructor(private firebaseMessage: FirebaseMessagingService) {}

  /**
   * Subscribe to a unique topic to send notifications
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async subscribeTopic(job: Job): Promise<JobResponse> {
    let error = false,
      data = null;
    try {
      data = await this.firebaseMessage.messaging.subscribeToTopic(
        job.payload.tokens,
        job.payload.topic,
      );
    } catch (err) {
      error = err;
    }
    job.done({ error, data });
    return job.response;
  }

  /**
   * UnSubscribe from subscribed unique topic
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async unSubscribeTopic(job: Job): Promise<JobResponse> {
    let error = false,
      data = null;
    try {
      data = await this.firebaseMessage.messaging.unsubscribeFromTopic(
        job.payload.tokens,
        job.payload.topic,
      );
    } catch (err) {
      error = err;
    }
    job.done({ error, data });
    return job.response;
  }

  /**
   * Send message to a token
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async send(job: Job): Promise<JobResponse> {
    let error = false,
      data = null;
    try {
      data = await this.firebaseMessage.messaging.send(job.payload);
    } catch (err) {
      error = err;
    }
    job.done({ error, data });
    return job.response;
  }

  /**
   * Send message to multiple tokens
   * @function
   * @param {object} job - mandatory - a job object representing the job information
   * @return {object} { error, data }
   */
  async sendMulticast(job: Job): Promise<JobResponse> {
    let error = false,
      data = null;
    try {
      if (!job.payload.tokens || !job.payload.tokens.length)
        return { error: `Invalid tokens` };
      data = await this.firebaseMessage.messaging.sendMulticast(job.payload);
    } catch (err) {
      error = err;
    }
    job.done({ error, data });
    return job.response;
  }
}
