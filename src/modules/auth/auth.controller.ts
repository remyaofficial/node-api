import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationError,
} from '@nestjs/common';
import {
  ApiTags,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
  /* ApiHeader, */
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from '../../decorators/public.decorator';
import {
  BadRequest,
  Created,
  ErrorResponse,
  Forbidden,
  Result,
  Unauthorized,
} from '../../core/utils/responses';
import { Owner, OwnerDto } from '../../decorators/owner.decorator';
import { AuthService } from './auth.service';
import { TokenAuthGuard } from './token/token-auth.guard';
import { TokenAuthDto } from './token/token-auth.dto';
import { LoginLog } from '../login-log/entities/login-log.schema';

import { LoginAsDto } from './dto/login-as.dto';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../auth/role.enum';
import { LogoutDto } from './dto/logout.dto';
import { LocalAuthDto } from './local/local-auth.dto';
import { LocalAuthGuard } from './local/local-auth.guard';
import { User } from '../user/entities/user.entity';
import { ResponseCreated } from 'src/core/utils/decorators';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Job } from 'src/core/utils/job';
import { UserService } from '../user/user.service';

// import { RecaptchaAuthGuard } from './recaptcha/recaptcha-auth.guard';

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
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and clear session' })
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res() res: Response,
    @Owner() owner: OwnerDto,
    @Body() body: LogoutDto,
  ) {
    if (!!body.session_id && !owner.sessionId) {
      owner.sessionId = body.session_id;
    }
    await this.authService.clearSession(owner);
    return Result(res, { message: 'Logout' });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Login on behalf of another user (Admin)' })
  @Roles(Role.Admin)
  @Post('user')
  async loginAs(
    @Req() req: Request,
    @Res() res: Response,
    @Owner() owner: OwnerDto,
    @Body() body: LoginAsDto,
  ) {
    const { error, data } = await this.authService.createUserSession(
      body.user_id,
    );
    if (!!error) {
      return Forbidden(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, { data, message: 'Login success' });
  }

  @Public()
  @ApiOperation({ summary: 'Get new token with refresh token' })
  @ApiOkResponse({
    description: 'Ok',
    schema: {
      properties: {
        data: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
            },
            token_expiry: {
              type: 'string',
              format: 'date-time',
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
  @UseGuards(TokenAuthGuard)
  @Post('token')
  async token(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: TokenAuthDto,
    @Owner() session: LoginLog,
  ) {
    const { error, data } = await this.authService.getNewToken(body, session);
    if (!!error) {
      return Forbidden(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, { data, message: 'Token created' });
  }

  /**
   * Login with username and password
   */
  @Post('login')
  @Public()
  @ApiOperation({ summary: 'User authentication' })
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
            },
            token_expiry: {
              type: 'string',
              format: 'date-time',
            },
            refresh_token: {
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
  @UseGuards(LocalAuthGuard)
  async localLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Owner() owner: OwnerDto,
    @Body() auth: LocalAuthDto,
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

  /**
   * Create a new User
   */
  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Create a new user' })
  @ResponseCreated(User)
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Owner() owner: OwnerDto,
    @Body() createUserDto: CreateUserDto,
  ) {
    const { error, data } = await this.userService.create(
      new Job({
        owner,
        action: 'create',
        body: createUserDto,
      }),
    );

    if (!!error) {
      if (error) {
        return BadRequest(res, {
          error,
          message: error.message,
        });
      }
      return ErrorResponse(res, {
        error,
        message: `${error.message || error}`,
      });
    }

    this.authService.createUser(owner, createUserDto);

    const result = await this.authService.createUserSession(data.id);
    if (!!result.error) {
      return Forbidden(res, {
        error,
        message: `${error.message || error}`,
      });
    }
    return Result(res, { data: result.data, message: 'Registration success' });
  }
}
