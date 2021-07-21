/**
 * The Base Error all App Errors inherit from.
 */
export class BaseError extends Error {
  public name: string;
}

/**
 * Thrown when a record was not found
 */
export class NotFoundError extends BaseError {}

/**
 * Thrown when a record was not found
 */
export class ValidationError extends BaseError {}
