import * as bcrypt from 'bcrypt';
import { isArray, isObject } from 'class-validator';
import { v1 as uuidv1 } from 'uuid';
import { operatorsAliases } from '../modules/database/database.module';
import { plural } from 'pluralize';

const saltOrRounds = 10;

export async function generateHash(text: string): Promise<string> {
  return await bcrypt.hash(text, saltOrRounds);
}

export async function compareHash(
  text: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(text, hash);
}

export const uuid = (): string => uuidv1();

export const otp = (length = 6): string =>
  `${Math.floor(
    Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
  )}`;

export const randomString = (length = 10): string =>
  Math.random().toString(36).substring(length);

export const snakeCase = (str: string): string =>
  str
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase();

export function convertWhere(where: any): any {
  try {
    if (typeof where !== 'object') return where;
    for (const key of Object.keys(where)) {
      if (Object.prototype.hasOwnProperty.call(where, key)) {
        const value = where[key];
        if (isArray(value)) {
          where[key] = value.map((x) => convertWhere(x));
        } else if (isObject(value)) {
          where[key] = convertWhere(value);
        }
        if (Object.prototype.hasOwnProperty.call(operatorsAliases, key)) {
          where[operatorsAliases[key]] = where[key];
          delete where[key];
        }
      }
    }
    return where;
  } catch (error) {
    return {};
  }
}

export function convertPopulate(populate: any): any {
  try {
    const _populate = [];
    for (let index = 0; index < populate.length; index++) {
      if (typeof populate[index] === 'string') {
        let association = populate[index];
        const isRequired = association.endsWith('*');
        const withDeleted = association.startsWith('+');
        const fetchSeparate =
          association.startsWith('+-') || association.startsWith('-');
        association = association.replace(/[*+-]/g, '');
        if (association.indexOf('.') > -1) {
          const associationArr = association.split('.');
          let parentInclude: any[] = _populate;
          for (let _index = 0; _index < associationArr.length - 1; _index++) {
            const _association = associationArr[_index];
            const parentAassociationIndex = parentInclude.findIndex(
              (x) => x.association === _association,
            );
            if (parentAassociationIndex > -1) {
              parentInclude[parentAassociationIndex].required =
                isRequired ||
                (parentInclude[parentAassociationIndex].required ?? undefined);
              parentInclude = parentInclude[parentAassociationIndex].include;
            } else {
              parentInclude.push({
                association: _association,
                include: [],
                required: isRequired || undefined,
              });
              parentInclude = parentInclude[parentInclude.length - 1].include;
            }
          }
          parentInclude.push({
            association: associationArr[associationArr.length - 1],
            include: [],
            required: isRequired || undefined,
            paranoid: withDeleted ? false : undefined,
            separate: fetchSeparate || undefined,
          });
        } else {
          _populate.push({
            association,
            include: [],
            required: isRequired || undefined,
            paranoid: withDeleted ? false : undefined,
            separate: fetchSeparate || undefined,
          });
        }
      }
    }
    return _populate;
  } catch (error) {
    return [];
  }
}

export const isPrimaryInstance = (): boolean =>
  typeof process.env.NODE_APP_INSTANCE === 'undefined' ||
  process.env.NODE_APP_INSTANCE === '0';

export const pluralizeString = (str: string): string => plural(str);
