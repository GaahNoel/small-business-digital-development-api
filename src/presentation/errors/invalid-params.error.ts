export class InvalidParamsError extends Error {
  constructor({ message = 'Invalid required params', params }) {
    super(`${message}: ${params.join(',')}`);
    this.name = 'InvalidParamsError';
  }
}
