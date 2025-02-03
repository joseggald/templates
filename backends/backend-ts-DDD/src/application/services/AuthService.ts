import { IAuthService } from '../../domain/interfaces/IAuthService';
import { PasswordUtils } from '../../shared/utils/auth.utils';
import { TokenUtils } from '../../shared/utils/token.utils';
import { AuthError } from '../../shared/errors/AuthError';

export class AuthService implements IAuthService {
  async hashPassword(password: string): Promise<string> {
    return await PasswordUtils.hash(password);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await PasswordUtils.compare(password, hash);
  }

  generateToken(payload: any): string {
    const { accessToken } = TokenUtils.generateTokens(payload);
    return accessToken;
  }

  verifyToken(token: string): any {
    return TokenUtils.verifyAccessToken(token);
  }
}