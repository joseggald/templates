export interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
  [key: string]: any;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: 'invalid_token' | 'expired_token' | 'invalid_password' | 'encryption_error'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
