import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Job } from '../../utils/job';

@Injectable()
export class EmailService {
  public constructor(private readonly mailerService: MailerService) {}

  async sendMail(job: Job) {
    let error = false,
      data = null;
    try {
      data = await this.mailerService.sendMail(job.payload);
    } catch (err) {
      error = err;
    }
    job.done({ error, data });
    return job.response;
  }
}
