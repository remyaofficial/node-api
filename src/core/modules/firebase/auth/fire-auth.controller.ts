import { Controller } from '@nestjs/common';
import { MsListener } from '../../../../core/utils/decorators';
import { Job, JobResponse } from '../../../utils/job';
import { FireAuthService } from './fire-auth.service';
import { MsClientService } from '../../../modules/ms-client/ms-client.service';

@Controller('fire-auth')
export class FireAuthController {
  constructor(
    private readonly fireAuthService: FireAuthService,
    private client: MsClientService,
  ) {}

  /**
   * Queue listener for FireAuth
   */
  @MsListener('controller.fire-auth')
  async execute(job: Job): Promise<void> {
    job = new Job(job);
    await this.fireAuthService[job.action]<JobResponse>(job);
    await this.client.jobDone(job);
  }
}
