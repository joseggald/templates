declare global {
  const Bun: {
    version: string;
    revision: string;
    write(fd: number, data: string): number;
    serve(options: {
      port?: number;
      hostname?: string;
      development?: boolean;
      [key: string]: any;
    }): void;
    file(path: string): { stream(): ReadableStream; text(): Promise<string>; };
    env: Record<string, string>;
    main: string;
    stdout: number;
    stderr: number;
  };
}

export {};