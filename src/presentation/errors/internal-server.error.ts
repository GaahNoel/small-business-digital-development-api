export class InternalServerError extends Error {
  constructor(stack: string | undefined) {
    super('Internal server error');
    this.name = 'ServerError';
    this.stack = stack;
  }
}
