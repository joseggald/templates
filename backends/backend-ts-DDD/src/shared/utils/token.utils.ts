import jwt from 'jsonwebtoken';
import { TokenPayload, TokenResponse } from '../types/auth.types';
import { AuthError } from '../errors/AuthError';
import { authConfig } from '../../infrastructure/config/auth.config';

export class TokenUtils {
  static generateTokens(payload: TokenPayload): TokenResponse {
    try {
      const accessToken = jwt.sign(payload, authConfig.jwt.accessTokenExpiry, {
        expiresIn: authConfig.jwt.accessTokenExpiry
      });

      const refreshToken = jwt.sign(payload, authConfig.jwt.refreshTokenExpiry, {
        expiresIn: authConfig.jwt.refreshTokenExpiry
      });

      return {
        accessToken,
        refreshToken,
        expiresIn: this.getExpirationTime(authConfig.jwt.accessTokenExpiry)
      };
    } catch (error) {
      throw AuthError.encryptionError('Error generating tokens');
    }
  }

  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, authConfig.jwt.accessTokenExpiry) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw AuthError.expiredToken();
      }
      throw AuthError.invalidToken();
    }
  }

  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, authConfig.jwt.refreshTokenExpiry) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw AuthError.expiredToken();
      }
      throw AuthError.invalidToken();
    }
  }

  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }

  private static getExpirationTime(expiration: string | number): number {
    if (typeof expiration === 'string') {
      // Convert expressions like '15m', '1h', '7d' to seconds
      const match = expiration.match(/^(\d+)([smhd])$/);
      if (!match) return 3600; // default 1 hour

      const [, time, unit] = match;
      const multipliers: { [key: string]: number } = {
        s: 1,
        m: 60,
        h: 3600,
        d: 86400
      };
      return parseInt(time) * multipliers[unit];
    }
    return expiration;
  }
}