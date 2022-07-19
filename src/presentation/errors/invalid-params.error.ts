export class InvalidParamsError extends Error {
  constructor({ message = 'Invalid params provided', params }) {
    super(`${message}: ${params.join(',')}`);
    this.name = 'InvalidParamsError';
  }
}
