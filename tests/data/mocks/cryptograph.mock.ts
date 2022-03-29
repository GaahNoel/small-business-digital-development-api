import faker from '@faker-js/faker';
import { Hasher } from '../protocols/cryptography';

export class HasherSpy implements Hasher {
  plaintext: string; // Parâmetro recebido

  digest = faker.datatype.uuid(); // Retorno forçado

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext;
    return Promise.resolve(this.digest);
  }
}
