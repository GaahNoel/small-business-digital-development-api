export class MissingParamsError extends Error {
  constructor({ message = 'Missing required params', params }) {
    super(`${message}: ${params.join(',')}`);
    this.name = 'MissingParamsError';
  }
}
