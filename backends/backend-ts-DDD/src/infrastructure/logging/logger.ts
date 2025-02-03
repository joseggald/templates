export class Logger {
  private static enabled: boolean = process.env.DEBUG === 'true';

  // Definición de colores ANSI
  private static readonly COLORS = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m"
  };

  private static getTime(): string {
    return new Date().toLocaleTimeString();
  }

  private static formatMessage(level: string, color: string, message: string): string {
    return `${color}[${this.getTime()}] [${level}]${this.COLORS.reset} ${message}`;
  }

  private static shouldLog(level: string): boolean {
    if (level === 'DEBUG') {
      return this.enabled;
    }
    return true;
  }

  static setDebug(enabled: boolean): void {
    this.enabled = enabled;
  }

  static isDebugEnabled(): boolean {
    return this.enabled;
  }

  static info(message: string, ...args: any[]) {
    if (this.shouldLog('INFO')) {
      console.log(
        this.formatMessage('INFO', this.COLORS.blue, message),
        ...args
      );
    }
  }

  static error(message: string, error?: any) {
    if (this.shouldLog('ERROR')) {
      console.error(
        this.formatMessage('ERROR', this.COLORS.red, message)
      );
      if (error?.stack) {
        console.error(`${this.COLORS.red}${error.stack}${this.COLORS.reset}`);
      } else if (error) {
        console.error(`${this.COLORS.red}${error}${this.COLORS.reset}`);
      }
    }
  }

  static warn(message: string, ...args: any[]) {
    if (this.shouldLog('WARN')) {
      console.warn(
        this.formatMessage('WARN', this.COLORS.yellow, message),
        ...args
      );
    }
  }

  static debug(message: string, ...args: any[]) {
    if (this.shouldLog('DEBUG')) {
      console.debug(
        this.formatMessage('DEBUG', this.COLORS.cyan, message),
        ...args
      );
    }
  }

  static success(message: string, ...args: any[]) {
    if (this.shouldLog('SUCCESS')) {
      console.log(
        this.formatMessage('OK', this.COLORS.green, message),
        ...args
      );
    }
  }

  static trace(message: string, ...args: any[]) {
    if (this.shouldLog('TRACE')) {
      console.debug(
        this.formatMessage('TRACE', this.COLORS.gray, message),
        ...args
      );
    }
  }

  /**
   * Log a message with a specific level and optional arguments
   */
  static log(level: 'info' | 'error' | 'warn' | 'debug' | 'success' | 'trace', message: string, ...args: any[]) {
    const colorMap = {
      info: this.COLORS.blue,
      error: this.COLORS.red,
      warn: this.COLORS.yellow,
      debug: this.COLORS.cyan,
      success: this.COLORS.green,
      trace: this.COLORS.gray
    };

    if (this.shouldLog(level.toUpperCase())) {
      console.log(
        this.formatMessage(level.toUpperCase(), colorMap[level], message),
        ...args
      );
    }
  }
}