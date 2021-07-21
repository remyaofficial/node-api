import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ParentSchema } from '../parent-schema';

export type JobLogDocument = JobLog & Document;

@Schema({
  collection: 'job_logs',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class JobLog extends ParentSchema {
  @Prop({ type: 'Mixed' })
  owner: any;

  @Prop()
  app: string;

  @Prop()
  action: string;

  @Prop()
  queue: string;

  @Prop()
  id: string;

  @Prop({ type: 'Mixed' })
  body: any;

  @Prop({ type: 'Mixed' })
  options: any;

  @Prop({ type: 'Mixed' })
  payload: any;

  @Prop({ type: 'Mixed' })
  response: any;

  @Prop()
  status: string;
}

export const JobLogSchema = SchemaFactory.createForClass(JobLog);
