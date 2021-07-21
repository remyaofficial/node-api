import {
  Type,
  applyDecorators,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';
import { MsGuard } from '../guards/ms.guard';
import { UploadInterceptor } from '../interceptors/upload.interceptors';
import {
  QuerySort,
  QueryPopulate,
  QueryWhere,
  QuerySelect,
  QuerySearch,
  QueryLimit,
  QueryOffset,
} from './definitions';
import { snakeCase, pluralizeString } from './helpers';

export interface FileUploadOption extends MulterField {
  required?: boolean;
  bodyField?:
    | string
    | {
        [key: string]: string;
      };
  message?: string;
}

export const ApiQueryGetAll = () => {
  return applyDecorators(
    ApiQuery(QueryOffset),
    ApiQuery(QueryLimit),
    ApiQuery(QuerySearch),
    ApiQuery(QuerySelect),
    ApiQuery(QueryWhere),
    ApiQuery(QueryPopulate),
    ApiQuery(QuerySort),
  );
};

export const ApiQueryCountAll = () => {
  return applyDecorators(
    ApiQuery(QuerySearch),
    ApiQuery(QueryWhere),
    ApiQuery(QueryPopulate),
  );
};

export const ApiQueryGetOne = () => {
  return applyDecorators(
    ApiQuery(QueryOffset),
    ApiQuery(QuerySearch),
    ApiQuery(QuerySelect),
    ApiQuery(QueryWhere),
    ApiQuery(QueryPopulate),
    ApiQuery(QuerySort),
  );
};

export const ApiQueryGetById = () => {
  return applyDecorators(ApiQuery(QuerySelect), ApiQuery(QueryPopulate));
};

export const ResponseGetAll = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Ok',
      schema: {
        properties: {
          data: {
            type: 'object',
            properties: {
              offset: {
                type: 'number',
                description: 'No of records to skip',
                example: 0,
              },
              limit: {
                type: 'number',
                description: 'No of records to take',
                example: 10,
              },
              count: {
                type: 'number',
                description: 'Total no of records available',
                example: 10,
              },
              [pluralizeString(snakeCase(model.name))]: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(model),
                },
              },
            },
          },
          message: {
            type: 'string',
            example: 'Ok',
          },
        },
      },
    }),
  );
};

export const ResponseCountAll = () => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Ok',
      schema: {
        properties: {
          data: {
            type: 'object',
            properties: {
              count: {
                type: 'number',
                description: 'Total no of records available',
                example: 10,
              },
            },
          },
          message: {
            type: 'string',
            example: 'Ok',
          },
        },
      },
    }),
  );
};

export const ResponseCreated = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Created',
      schema: {
        properties: {
          data: {
            type: 'object',
            properties: {
              [snakeCase(model.name)]: {
                $ref: getSchemaPath(model),
              },
            },
          },
          message: {
            type: 'string',
            example: 'Created',
          },
        },
      },
    }),
  );
};

export const ResponseUpdated = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Updated',
      schema: {
        properties: {
          data: {
            type: 'object',
            properties: {
              [snakeCase(model.name)]: {
                $ref: getSchemaPath(model),
              },
            },
          },
          message: {
            type: 'string',
            example: 'Updated',
          },
        },
      },
    }),
  );
};

export const ResponseGetOne = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Ok',
      schema: {
        properties: {
          data: {
            type: 'object',
            properties: {
              [snakeCase(model.name)]: {
                $ref: getSchemaPath(model),
              },
            },
          },
          message: {
            type: 'string',
            example: 'Ok',
          },
        },
      },
    }),
  );
};

export const ResponseDeleted = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      description: 'Deleted',
      schema: {
        properties: {
          data: {
            type: 'object',
            properties: {
              [snakeCase(model.name)]: {
                $ref: getSchemaPath(model),
              },
            },
          },
          message: {
            type: 'string',
            example: 'Deleted',
          },
        },
      },
    }),
  );
};

export const FileUploads = (files: FileUploadOption[]) => {
  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(files),
      ...files.map((x) => new UploadInterceptor(x)),
    ),
  );
};

export const MsListener = (queue: string) => {
  return applyDecorators(UseGuards(MsGuard), MessagePattern(queue));
};
