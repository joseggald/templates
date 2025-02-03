import { Response } from 'express';

export async function sendSuccess(res: Response, message: string, data: any, statusCode: number = 200): Promise<void> {
  res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
}

export async function sendError(res: Response, message: string, statusCode: number, data?:any): Promise<void> {
  res.status(statusCode).json({
    status: 'error',
    message,
    data
  });
}