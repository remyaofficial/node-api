import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FirebaseAuthDto {
  @ApiProperty({
    description: 'Token',
    example: 'token',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Additional session info',
    default: {},
  })
  info: any;
}
