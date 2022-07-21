import { FindAccountByEmailRepository } from '@/data/protocols';
import { HashComparer } from '@/data/protocols/cryptography';
import { CheckAccountPassword, CheckAccountPasswordParams } from '@/domain/usecases/account/check-account-password';
import { NotFound } from '@/presentation/errors';

export class DbCheckAccountPassword implements CheckAccountPassword {
  constructor(private readonly findAccountByEmailRepository: FindAccountByEmailRepository, private readonly hashComparer: HashComparer) {}

  async check(addAccountParams: CheckAccountPasswordParams): Promise<CheckAccountPassword.Result> {
    const account = await this.findAccountByEmailRepository.findByEmail(addAccountParams);
    if (!account) {
      throw new NotFound({
        entity: 'Account',
      });
    }

    const isPasswordValid = await this.hashComparer.compare(addAccountParams.password, account.password);

    return {
      id: isPasswordValid === true ? account.id : null,
      match: isPasswordValid,
      verified: account.verified,
    };
  }
}
