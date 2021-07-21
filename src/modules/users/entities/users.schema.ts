import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { ParentSchema } from '../../../core/modules/mongo/parent-schema';

export type UsersDocument = Users & Document;

@Schema({
  collection: 'users',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Users extends ParentSchema {
 

  @Prop()
  @ApiProperty({
    description: 'Email',
    example: 'remya@gmail.com',
  })
  email: string;

  @Prop()
  @ApiProperty({
    description: 'Name',
    example: 'Remya P R',
  })
  name: string;

  @Prop()
  @ApiProperty({
    description: 'Password',
    example: '123456',
  })
  password: string;

  
  @Prop({
    default: true,
  })
  @ApiProperty({
    description: 'Is Active?',
    example: false,
  })
  active: boolean;
  
}

export const UsersSchema = SchemaFactory.createForClass(Users);
