import { Request, Response, NextFunction } from 'express';
import { BaseError, ErrorType } from '../../shared/errors/BaseError';
import { sendError } from '../responses/responses';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  sendError(res, error.message, 500,
    {
      name: error.name,
      stack: error.stack,
      path: req.path,
      method: req.method
    }
  );
  // Handle BaseError instances
  if (error instanceof BaseError) {
    return res.status(error.statusCode).json(error.toJSON());
  }

  // Handle JWT specific errors
  if (error.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token', 401,
      {
        type: ErrorType.AUTHENTICATION,
        code: 'INVALID_TOKEN',
      }
    );
  }

  if (error.name === 'TokenExpiredError') {
    return sendError(res, 'Token has expired', 401,
      {
        type: ErrorType.AUTHENTICATION,
        code: 'EXPIRED_TOKEN'
      }
    );
  }

  // Handle unknown errors
  return sendError(res, 'Internal server error', 500);
};