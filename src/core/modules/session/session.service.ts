import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Job } from '../../utils/job';

@Injectable()
export class SessionService {
  constructor(private jwt: JwtService, private config: ConfigService) {}

  async verifyToken(job: Job) {
    try {
      const data = await this.jwt.verifyAsync(job.payload.token, {
        secret: this.config.get('jwt').secret,
      });
      return { data };
    } catch (error) {
      return { error };
    }
  }
}
