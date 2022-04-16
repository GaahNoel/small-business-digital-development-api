import { FindAccountByEmailRepository } from '@/data/protocols';
import { Decrypter } from '@/data/protocols/cryptography';
import { AuthAccount } from '@/domain/usecases/account/auth-account';

export class DbAuthAccount implements AuthAccount {
  constructor(
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly decrypter : Decrypter,
  ) {}

  async auth(authAccountParams: AuthAccount.Params): Promise<AuthAccount.Result> {
    const decryptedToken = await this.decrypter.decrypt(authAccountParams.token) as any;

    const account = await this.findAccountByEmailRepository.findByEmail({
      email: decryptedToken.email,
    });

    if (!account) {
      return null;
    }

    return {
      id: account.id,
    };
  }
}
