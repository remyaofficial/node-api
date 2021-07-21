import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  BelongsTo,
  ForeignKey,
  DefaultScope,
  BeforeSave,
  BeforeCreate,
  DataType,
} from 'sequelize-typescript';
import { Entity } from '../../../core/modules/database/entity';
import { generateHash, uuid } from '../../../core/utils/helpers';
import { AuthProvider } from '../../auth/auth-provider.enum';
import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  Max,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

@DefaultScope(() => ({
  attributes: { exclude: ['password', 'deleted_at'] },
}))
@Table
export class User extends Entity<User> {
  @Column({ unique: 'uid' })
  @ApiProperty({
    description: 'Unique ID',
    example: 'a926d382-6741-4d95-86cf-1f5c421cf654',
    readOnly: true,
  })
  uid: string;

  @Column({
    type: DataType.ENUM(...Object.keys(AuthProvider)),
    defaultValue: 'Local',
  })
  @ApiProperty({
    enum: AuthProvider,
    description: 'Auth Provider',
    example: 'Local',
    readOnly: true,
  })
  provider: AuthProvider;  

  @Column
  @ApiProperty({
    description: 'Full Name',
    example: 'Ross Geller',
    readOnly: true,
  })
  name?: string;

  @Column
  @ApiProperty({
    description: 'Email',
    example: 'ross.geller@gmail.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @Column
  @ApiProperty({
    description: 'Password',
    example: '123456',
    writeOnly: true,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @Column
  @ApiProperty({
    format: 'date-time',
    description: 'Last Login At',
    example: '2021-01-01T00:00:00Z',
    readOnly: true,
  })
  last_login_at?: Date;

  toJSON() {
    const user = Object.assign(super.toJSON(), { password: undefined });
    return user;
  }  

  @BeforeCreate
  static async hashPassword(instance: User) {
    if (!!instance.password) {
      instance.password = await generateHash(instance.password);
    }
  }

  @BeforeCreate
  static setUuid(instance: User) {
    instance.uid = uuid();
  }
}
