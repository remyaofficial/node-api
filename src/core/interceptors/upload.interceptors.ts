import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { FileUploadOption } from '../utils/decorators';

@Injectable()
export class UploadInterceptor implements NestInterceptor {
  constructor(private options: FileUploadOption) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { body, files } = context.switchToHttp().getRequest();
    if (typeof files === 'undefined') return next.handle();
    if (
      !!this.options.required &&
      typeof files[this.options.name] === 'undefined'
    ) {
      return throwError(
        new BadRequestException(
          this.options.message || `No file uploaded - ${this.options.name}`,
        ),
      );
    }
    if (
      typeof this.options.bodyField === 'string' &&
      typeof files[this.options.name] !== 'undefined'
    ) {
      body[this.options.bodyField] =
        files[this.options.name][0].key || files[this.options.name][0].filename;
    }
    if (
      typeof this.options.bodyField === 'object' &&
      typeof files[this.options.name] !== 'undefined'
    ) {
      for (const key in this.options.bodyField) {
        if (Object.prototype.hasOwnProperty.call(this.options.bodyField, key)) {
          const prop = this.options.bodyField[key];
          body[key] = files[this.options.name][0][prop];
        }
      }
    }
    return next.handle();
  }
}
