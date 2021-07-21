import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

@Schema()
export class ParentSchema {
  @ApiProperty({
    description: 'ID',
    example: '606d990740d3ba3480dae119',
    readOnly: true,
  })
  _id: string;

  @Prop({
    default: true,
  })
  @ApiProperty({
    description: 'Is Active?',
    example: true,
    required: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  active: boolean;

  @ApiProperty({
    format: 'date-time',
    description: 'Created At',
    example: '2021-01-01T00:00:00Z',
    readOnly: true,
  })
  created_at: Date;

  @Prop({
    default: null,
  })
  @ApiProperty({
    format: 'int32',
    description: 'Created By',
    example: 1,
    readOnly: true,
  })
  created_by: number;

  @ApiProperty({
    format: 'date-time',
    description: 'Updated At',
    example: '2021-01-01T00:00:00Z',
    readOnly: true,
  })
  updated_at: Date;

  @Prop({
    default: null,
  })
  @ApiProperty({
    format: 'int32',
    description: 'Updated By',
    example: 1,
    readOnly: true,
  })
  updated_by: number;

  @Prop({
    default: null,
  })
  deleted_at: Date;
}
