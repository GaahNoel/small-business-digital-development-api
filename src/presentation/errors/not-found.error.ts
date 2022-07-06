export class NotFound extends Error {
  constructor({ message = 'Not found', entity = '' }) {
    super(`${entity.toUpperCase()}: ${message}`);
    this.name = 'NotFound';
  }
}
