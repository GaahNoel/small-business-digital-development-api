import { FindAccountByEmailRepository } from '@/data/protocols';
import { Decrypter } from '@/data/protocols/cryptography';
import { AuthAccount } from '@/domain/usecases/account/auth-account';

export class DbAuthAccount implements AuthAccount {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly decrypter : Decrypter,
  ) {}

  async auth(authAccountParams: AuthAccount.Params): Promise<AuthAccount.Result> {
    const decryptedToken = await this.decrypter.decrypt(authAccountParams.token);
    const { email } = JSON.parse(decryptedToken);

    const account = await this.findAccountByEmailRepository.findByEmail({
      email,
    });

    if (!account) {
      throw new Error('User not found');
    }

    return {
      id: account.id,
    };
  }
}
