import { Request, Response } from 'express';
import { ResponseHandler } from '../utils/responses';
import { pongSchema } from './validators/health.validator';
const { sendSuccess, sendError } = ResponseHandler;


export class HealthController {
  /**
   * Método para verificar si la API está en funcionamiento
   * @param req - Objeto de solicitud HTTP de Express
   * @param res - Objeto de respuesta HTTP de Express
   */

  public async check(req: Request, res: Response): Promise<void> {
    sendSuccess(res, 'API is running');
  }

  public async checkPost(req: Request, res: Response): Promise<void> {
    const { error, value } = pongSchema.validate(req.body);

    if (error) {
      sendError(res, `Invalid pong value: ${error.message}`, 400);
      return;
    }

    const { pong } = value;

    if (pong === 1) {
      sendSuccess(res, 'ping');
    } else {
      sendError(res, 'Invalid pong value. Expected pong to be 1.', 400);
    }
  }
}