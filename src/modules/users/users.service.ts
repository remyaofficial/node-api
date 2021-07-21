import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModelService } from '../../core/modules/mongo/model.service';
import { UsersDocument, Users } from './entities/users.schema';

@Injectable()
export class UsersService extends ModelService {
  constructor(@InjectModel(Users.name) usersModel: Model<UsersDocument>) {
    super(usersModel);
  }
}
