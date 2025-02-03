import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/AuthService';
import { sendError } from '../../infrastructure/responses/responses';

export const authMiddleware = (authService: AuthService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        sendError(res, 'No token provided', 401);
        return;
      }

      const decoded = authService.verifyToken(token);
      req.body.user = decoded;
      next();
    } catch (error) {
      sendError(res, 'Invalid token', 401);
    }
  };
};