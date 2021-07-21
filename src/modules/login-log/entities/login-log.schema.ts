import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { ParentSchema } from '../../../core/modules/mongo/parent-schema';

export type LoginLogDocument = LoginLog & Document;

@Schema({
  collection: 'login_logs',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class LoginLog extends ParentSchema {
  @Prop()
  @ApiProperty({
    format: 'int32',
    description: 'User ID',
    example: 1,
  })
  user_id: number;

  @Prop()
  @ApiProperty({
    description: 'Refresh Token',
    example: 'e9e93e0a5acfb6358c7c9fd91579b048d40574a',
  })
  token: string;

  @Prop({
    default: Date.now,
  })
  @ApiProperty({
    format: 'date-time',
    description: 'Login At',
    example: '2021-01-01T00:00:00Z',
  })
  login_at: Date;

  @Prop()
  @ApiProperty({
    format: 'date-time',
    description: 'Logout At',
    example: '2021-01-01T00:00:00Z',
  })
  logout_at: Date;

  @Prop({
    default: true,
  })
  @ApiProperty({
    description: 'Is Active?',
    example: false,
  })
  active: boolean;

  @Prop({ type: 'Mixed' })
  @ApiProperty({
    type: {},
    description: 'Info',
  })
  info: any;
}

export const LoginLogSchema = SchemaFactory.createForClass(LoginLog);
