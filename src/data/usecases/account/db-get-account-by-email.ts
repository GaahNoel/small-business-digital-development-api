import { FindAccountByEmailRepository } from '@/data/protocols';
import { GetAccountByEmail } from '@/domain/usecases/account/get-account-by-email';

export class DbGetAccountByEmail implements GetAccountByEmail {
  constructor(private readonly findAccountRepository: FindAccountByEmailRepository) {}

  async get(params: GetAccountByEmail.Params): Promise<GetAccountByEmail.Result> {
    const account = await this.findAccountRepository.findByEmail({
      email: params.email,
    });
    return {
      id: account.id,
      verified: account.verified,
      email: account.email,
      name: account.name,
      provider: account.provider,
    };
  }
}
