export class Logger {
  private static enabled: boolean = process.env.DEBUG === 'true';

  // Códigos de color ANSI
  private static readonly COLORS = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    blue: "\x1b[34m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    gray: "\x1b[90m",
    green: "\x1b[32m"
  };

  private static getTime(): string {
    return new Date().toLocaleTimeString();
  }

  private static formatMessage(level: string, color: string, message: string): string {
    return `${color}[${this.getTime()}][${level}] ${message}${this.COLORS.reset}`;
  }

  static async info(message: string, ...args: any[]): Promise<void> {
    console.log(
      this.formatMessage('INFO', this.COLORS.blue, message),
      ...args
    );
  }

  static async error(message: string, error?: any): Promise<void> {
    console.error(
      this.formatMessage('ERROR', this.COLORS.red, message)
    );
    if (error?.stack) {
      console.error(`${this.COLORS.red}${error.stack}${this.COLORS.reset}`);
    } else if (error) {
      console.error(`${this.COLORS.red}${error}${this.COLORS.reset}`);
    }
  }

  static async warn(message: string, ...args: any[]): Promise<void> {
    console.warn(
      this.formatMessage('WARN', this.COLORS.yellow, message),
      ...args
    );
  }

  static async debug(message: string, ...args: any[]): Promise<void> {
    if (!this.enabled) return;
    console.debug(
      this.formatMessage('DEBUG', this.COLORS.gray, message),
      ...args
    );
  }

  static async ok(message: string, ...args: any[]): Promise<void> {
    console.log(
      this.formatMessage('OK', this.COLORS.green, message),
      ...args
    );
  }

  static log(message: string, type: 'info' | 'error' | 'warn' | 'debug' | 'ok' = 'info'): void {
    const colorMap = {
      info: this.COLORS.blue,
      error: this.COLORS.red,
      warn: this.COLORS.yellow,
      debug: this.COLORS.gray,
      ok: this.COLORS.green
    };

    console.log(
      this.formatMessage(
        type.toUpperCase(),
        colorMap[type],
        message
      )
    );
  }
}