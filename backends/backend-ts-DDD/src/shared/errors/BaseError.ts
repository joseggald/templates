export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL = 'INTERNAL'
}

export interface ErrorMetadata {
  code: string;
  statusCode: number;
  isOperational?: boolean;
  [key: string]: any;
}

export abstract class BaseError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly metadata: ErrorMetadata;

  constructor(
    message: string,
    type: ErrorType,
    metadata: Partial<ErrorMetadata> = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    this.statusCode = metadata.statusCode || this.getDefaultStatusCode();
    this.isOperational = metadata.isOperational ?? true;
    this.metadata = {
      code: metadata.code || this.type,
      statusCode: this.statusCode,
      ...metadata
    };
    
    Error.captureStackTrace(this, this.constructor);
  }

  private getDefaultStatusCode(): number {
    switch (this.type) {
      case ErrorType.VALIDATION:
        return 400;
      case ErrorType.AUTHENTICATION:
        return 401;
      case ErrorType.AUTHORIZATION:
        return 403;
      case ErrorType.NOT_FOUND:
        return 404;
      case ErrorType.CONFLICT:
        return 409;
      default:
        return 500;
    }
  }

  public toJSON() {
    return {
      error: {
        type: this.type,
        message: this.message,
        ...this.metadata
      }
    };
  }
}