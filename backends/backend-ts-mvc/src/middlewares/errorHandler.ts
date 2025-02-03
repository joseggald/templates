import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/Logger';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  Logger.error(`Error Handler: ${message}`, error);

  res.status(status).json({
    status: 'error',
    message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
};