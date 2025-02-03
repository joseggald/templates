import { AuthError } from '../errors/AuthError';
import bcrypt from 'bcrypt';
import { authConfig } from '../../infrastructure/config/auth.config';

export class PasswordUtils {
  static async hash(password: string): Promise<string> {
    try {
      if (!this.isValidPassword(password)) {
        throw AuthError.invalidPassword(
          `Password must be between ${authConfig.password.minLength} and ${authConfig.password.maxLength} characters`
        );
      }

      const salt = await bcrypt.genSalt(authConfig.password.saltRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw AuthError.encryptionError('Error hashing password');
    }
  }

  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      const isValid = await bcrypt.compare(password, hashedPassword);
      if (!isValid) {
        throw AuthError.invalidCredentials();
      }
      return true;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw AuthError.encryptionError('Error comparing passwords');
    }
  }

  private static isValidPassword(password: string): boolean {
    return (
      password.length >= authConfig.password.minLength &&
      password.length <= authConfig.password.maxLength
    );
  }
}
