import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import {
  BeforeCount,
  Column,
  CreatedAt,
  DefaultScope,
  DeletedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@DefaultScope(() => ({
  attributes: { exclude: ['deleted_at'] },
}))
@Table({
  underscored: true,
})
export class Entity<T> extends Model<T> {
  @ApiProperty({
    format: 'int32',
    description: 'ID',
    example: 1,
    readOnly: true,
  })
  id: number;

  @Column({ defaultValue: true })
  @ApiProperty({
    description: 'Is Active?',
    example: true,
    required: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  active: boolean;

  @CreatedAt
  @ApiProperty({
    format: 'date-time',
    description: 'Created At',
    example: '2021-01-01T00:00:00Z',
    readOnly: true,
  })
  created_at: Date;

  @Column
  @ApiProperty({
    format: 'int32',
    description: 'Created By',
    example: 1,
    readOnly: true,
  })
  created_by: number;

  @UpdatedAt
  @ApiProperty({
    format: 'date-time',
    description: 'Updated At',
    example: '2021-01-01T00:00:00Z',
    readOnly: true,
  })
  updated_at: Date;

  @Column
  @ApiProperty({
    format: 'int32',
    description: 'Updated By',
    example: 1,
    readOnly: true,
  })
  updated_by: number;

  @DeletedAt
  deleted_at: Date;

  /**
   * Fix total count while calling findAndCountAll with include
   */
  @BeforeCount
  static fixCountWhileInclude(options: any) {
    if (
      options.include &&
      options.include.length > 0 &&
      typeof options.distinct === 'undefined'
    ) {
      options.distinct = true;
    }
  }
}
