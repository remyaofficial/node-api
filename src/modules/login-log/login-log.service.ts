import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModelService } from '../../core/modules/mongo/model.service';
import { LoginLog, LoginLogDocument } from './entities/login-log.schema';

@Injectable()
export class LoginLogService extends ModelService {
  constructor(
    @InjectModel(LoginLog.name) loginLogModel: Model<LoginLogDocument>,
  ) {
    super(loginLogModel);
  }
}
