import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isDefined } from 'class-validator';

@Injectable()
export class QueryGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const params =
      this.reflector.getAllAndOverride<any[]>('swagger/apiParameters', [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    const { query } = context.switchToHttp().getRequest();
    for (let index = 0; index < params.length; index++) {
      const param = params[index];
      if (param.schema && param.schema.format === 'json' && query[param.name]) {
        try {
          query[param.name] = JSON.parse(query[param.name]);
        } catch (error) {
          throw new BadRequestException(
            `${param.name} should be valid JSON string.`,
          );
        }
      }
      if (
        (param.type === 'integer' || param.type === 'number') &&
        isDefined(query[param.name])
      ) {
        query[param.name] = +query[param.name];
      }
    }
    return true;
  }
}
