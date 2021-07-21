import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import * as moment from 'moment-timezone';
import { DATE } from 'sequelize';

/**
 * Validate if value is equal to another field value
 */
export function IsEqual(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
}

/**
 * Validate if value is not equal to another field value
 */
export function IsNotEqual(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isNotEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value !== relatedValue;
        },
      },
    });
  };
}

/**
 * Validate if value is greater than another field value
 */
export function IsGreaterThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const isDate =
            object.rawAttributes[propertyName].type instanceof DATE;
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof relatedValue === 'undefined' ||
            (typeof value === typeof relatedValue &&
              (isDate
                ? moment(value).valueOf() > moment(relatedValue).valueOf()
                : value > relatedValue))
          );
        },
      },
    });
  };
}

/**
 * Validate if value is greater than or equals to another field value
 */
export function IsGreaterThanEqual(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThanEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const isDate =
            object.rawAttributes[propertyName].type instanceof DATE;
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof relatedValue === 'undefined' ||
            (typeof value === typeof relatedValue &&
              (isDate
                ? moment(value).valueOf() >= moment(relatedValue).valueOf()
                : value >= relatedValue))
          );
        },
      },
    });
  };
}

/**
 * Validate if value is less than another field value
 */
export function IsLessThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isLessThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const isDate =
            object.rawAttributes[propertyName].type instanceof DATE;
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof relatedValue === 'undefined' ||
            (typeof value === typeof relatedValue &&
              (isDate
                ? moment(value).valueOf() < moment(relatedValue).valueOf()
                : value < relatedValue))
          );
        },
      },
    });
  };
}

/**
 * Validate if value is less than or equals to another field value
 */
export function IsLessThanEqual(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isLessThanEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const isDate =
            object.rawAttributes[propertyName].type instanceof DATE;
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof relatedValue === 'undefined' ||
            (typeof value === typeof relatedValue &&
              (isDate
                ? moment(value).valueOf() <= moment(relatedValue).valueOf()
                : value <= relatedValue))
          );
        },
      },
    });
  };
}
