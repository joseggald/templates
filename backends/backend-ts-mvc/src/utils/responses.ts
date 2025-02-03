import { Response } from 'express';
import { Logger } from './Logger';
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  timestamp?: string;
  path?: string;
}

export class ResponseHandler {
  static async sendSuccess<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: number = 200
  ): Promise<void> {
    const response: ApiResponse<T> = {
      status: 'success',
      message,
      data,
      path: res.req.originalUrl
    };

    Logger.ok(`[${statusCode}] ${message}`);
    res.status(statusCode).json(response);
  }

  static async sendError(
    res: Response,
    message: string,
    statusCode: number = 500,
    data?: any
  ): Promise<void> {
    const response: ApiResponse = {
      status: 'error',
      message,
      data,
      path: res.req.originalUrl
    };

    Logger.error(`[${statusCode}] ${message}`, data);
    res.status(statusCode).json(response);
  }
}