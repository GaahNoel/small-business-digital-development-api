export class AccessDeniedError extends Error {
  constructor(stack: string | undefined) {
    super('Access denied error');
    this.name = 'AccessDeniedError';
    this.stack = stack;
  }
}
