import { Request, Response } from 'express';
import { Logger } from '../../logging/logger';
import { sendSuccess, sendError } from '../../responses/responses';
import { AuthService } from '../../../application/services/AuthService';

export class HealthController {
  constructor(private authService: AuthService) {}

  async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      // Test de hashing
      const password = "testPassword123";
      const hashedPassword = await this.authService.hashPassword(password);
      const isValidPassword = await this.authService.comparePassword(password, hashedPassword);

      // Test de tokens
      const testPayload = { userId: '123', email: 'test@test.com' };
      const token = this.authService.generateToken(testPayload);
      const decodedToken = this.authService.verifyToken(token);
      const data = {
        serverStatus: 'up and running',
        authTests: {
          hashing: {
            originalPassword: password,
            hashedPassword: hashedPassword,
            passwordValid: isValidPassword
          },
          jwt: {
            originalPayload: testPayload,
            token: token,
            decodedToken: decodedToken
          }
        }
      };
      Logger.info('Health check successful');
      sendSuccess(res, 'Auth test results', data);
    } catch (error) {
      Logger.error('Error in health check:', error);
      sendError(res, 'Error in health check', 500);
    }
  }

  async protectedPing(req: Request, res: Response): Promise<void> {
    try {
      const { ping } = req.body;
      const user = req.body.user; 

      if (!ping) {
        sendError(res, 'ping is required', 400);
        return;
      }

      // Test adicional de hashing
      const testPassword = "pingPassword123";
      const hashedPing = await this.authService.hashPassword(testPassword);

      sendSuccess(res, 'Protected endpoint test results', {
        ping,
        user,
        hashTest: {
          original: testPassword,
          hashed: hashedPing
        }
      });
      Logger.success('Protected ping successful');
    } catch (error) {
      Logger.error('Error in protected ping:', error);
      sendError(res, 'Error in protected ping', 500);
    }
  }
}
