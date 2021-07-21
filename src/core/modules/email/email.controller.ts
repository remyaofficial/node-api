import { Controller } from '@nestjs/common';
import { MsListener } from '../../../core/utils/decorators';
import { Job, JobResponse } from '../../utils/job';
import { EmailService } from './email.service';
import { MsClientService } from '../../modules/ms-client/ms-client.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private client: MsClientService,
  ) {}

  /**
   * Queue listener for Email
   */
  @MsListener('controller.email')
  async execute(job: Job): Promise<void> {
    job = new Job(job);
    await this.emailService[job.action]<JobResponse>(job);
    await this.client.jobDone(job);
  }
}
