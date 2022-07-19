import {faker} from '@faker-js/faker';
import { Hasher } from '../protocols/cryptography';

export class HasherSpy implements Hasher {
  plaintext: string;

  digest = faker.datatype.uuid();

  async hash(plaintext: string): Promise<string> {
    this.plaintext = plaintext;
    return Promise.resolve(this.digest);
  }
}
