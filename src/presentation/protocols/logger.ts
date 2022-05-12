export interface Logger {
  info(message: string, payload?: any): void;
  error(message: string, payload?: any): void;
}
