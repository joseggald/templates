import dotenv from 'dotenv';
dotenv.config();

export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your_default_secret_key',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '1d',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d'
  },
  password: {
    saltRounds: Number(process.env.SALT_ROUNDS) || 10,
    minLength: Number(process.env.PASSWORD_MIN_LENGTH) || 8,
    maxLength: Number(process.env.PASSWORD_MAX_LENGTH) || 100
  }
}
