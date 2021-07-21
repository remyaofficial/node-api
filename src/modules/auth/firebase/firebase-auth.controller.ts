import { Controller, Post, Req, Res, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiExtraModels,
  ApiOperation,
  getSchemaPath,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Unauthorized, Result } from '../../../core/utils/responses';
import { Owner, OwnerDto } from '../../../decorators/owner.decorator';
import { User } from '../../user/entities/user.entity';
import { Public } from '../../../decorators/public.decorator';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { FirebaseAuthDto } from './firebase-auth.dto';
import { AuthService } from '../auth.service';

@ApiTags('auth')
@ApiForbiddenResponse({
  description: 'Forbidden',
  schema: {
    properties: {
      message: {
        type: 'string',
        example: 'Forbidden',
      },
    },
  },
})
@ApiInternalServerErrorResponse({
  description: 'Server error',
  schema: {
    properties: {
      error: {
        type: 'object',
      },
      message: {
        type: 'string',
        example: 'Server error',
      },
    },
  },
})
@ApiExtraModels(User)
@Controller('auth/firebase')
export class FirebaseAuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login with firebase access token
   */
  @Post('')
  @Public()
  @ApiOperation({ summary: 'Firebase token authentication' })
  @ApiOkResponse({
    description: 'Login success',
    schema: {
      properties: {
        data: {
          type: 'object',
          properties: {
            user: {
              $ref: getSchemaPath(User),
            },
            token: {
              type: 'string',
              deprecated: true,
            },
            refresh_token: {
              type: 'string',
              deprecated: true,
            },
            session_id: {
              type: 'string',
            },
          },
        },
        message: {
          type: 'string',
          example: 'Created',
        },
      },
    },
  })
  @UseGuards(FirebaseAuthGuard)
  async firebaseLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Owner() owner: OwnerDto,
    @Body() auth: FirebaseAuthDto,
  ) {
    const { error, data } = await this.authService.createSession(
      owner,
      auth.info,
    );
    if (!!error) {
      return Unauthorized(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, { data, message: 'Login success' });
  }
}
