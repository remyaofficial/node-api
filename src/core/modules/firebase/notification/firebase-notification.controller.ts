import { Controller } from '@nestjs/common';
import { MsListener } from '../../../../core/utils/decorators';
import { Job, JobResponse } from '../../../utils/job';
import { FirebaseNotificationService } from './firebase-notification.service';
import { MsClientService } from '../../../modules/ms-client/ms-client.service';

@Controller('firebase-notification')
export class FirebaseNotificationController {
  constructor(
    private readonly firebaseNotificationService: FirebaseNotificationService,
    private client: MsClientService,
  ) {}

  /**
   * Queue listener for FirebaseNotification
   */
  @MsListener('controller.firebase-notification')
  async execute(job: Job): Promise<void> {
    job = new Job(job);
    await this.firebaseNotificationService[job.action]<JobResponse>(job);
    await this.client.jobDone(job);
  }
}
