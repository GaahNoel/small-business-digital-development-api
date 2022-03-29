import { sign, verify } from 'jsonwebtoken';
import { Decrypter, Encrypter } from '@/data/protocols/cryptography';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(
    private readonly secret: string,
  ) {}

  async encrypt(plaintext: string): Promise<string> {
    const ciphertext = await sign({ id: plaintext }, this.secret);

    return ciphertext;
  }

  async decrypt(ciphertext: string): Promise<string> {
    const plaintext: any = await verify(ciphertext, this.secret);
    return plaintext;
  }
}
