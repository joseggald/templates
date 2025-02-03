import { BaseError, ErrorMetadata, ErrorType } from './BaseError';

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  PASSWORD_MISMATCH = 'PASSWORD_MISMATCH',
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  SESSION_EXPIRED = 'SESSION_EXPIRED'
}

export class AuthError extends BaseError {
  constructor(
    message: string,
    code: AuthErrorCode,
    metadata: Partial<ErrorMetadata> = {}
  ) {
    super(message, ErrorType.AUTHENTICATION, {
      code,
      ...metadata
    });
  }

  static invalidCredentials(message = 'Invalid credentials'): AuthError {
    return new AuthError(message, AuthErrorCode.INVALID_CREDENTIALS);
  }

  static invalidToken(message = 'Invalid token'): AuthError {
    return new AuthError(message, AuthErrorCode.INVALID_TOKEN);
  }

  static expiredToken(message = 'Token has expired'): AuthError {
    return new AuthError(message, AuthErrorCode.EXPIRED_TOKEN);
  }

  static tokenNotFound(message = 'Token not provided'): AuthError {
    return new AuthError(message, AuthErrorCode.TOKEN_NOT_FOUND);
  }

  static invalidPassword(message = 'Invalid password format'): AuthError {
    return new AuthError(message, AuthErrorCode.INVALID_PASSWORD);
  }

  static passwordMismatch(message = 'Passwords do not match'): AuthError {
    return new AuthError(message, AuthErrorCode.PASSWORD_MISMATCH);
  }

  static encryptionError(message = 'Encryption error'): AuthError {
    return new AuthError(message, AuthErrorCode.ENCRYPTION_ERROR, {
      isOperational: false
    });
  }

  static userNotFound(message = 'User not found'): AuthError {
    return new AuthError(message, AuthErrorCode.USER_NOT_FOUND);
  }

  static userAlreadyExists(message = 'User already exists'): AuthError {
    return new AuthError(message, AuthErrorCode.USER_ALREADY_EXISTS, {
      statusCode: 409
    });
  }
}