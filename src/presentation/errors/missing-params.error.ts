export class MissingParamsError extends Error {
  constructor(message: string = 'Missing required params') {
    super(message);
    this.name = 'MissingParamsError';
  }
}
