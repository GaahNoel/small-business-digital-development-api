import { VerifyAccountRepository } from '@/data/protocols/db/account';
import { VerifyAccount } from '@/domain/usecases/account/verify-account';

export class EmailVerifyAccount implements VerifyAccount {
  constructor(private readonly verifyAccountRepository: VerifyAccountRepository) {}

  async verify(params: VerifyAccount.Params): Promise<VerifyAccount.Result> {
    const verified = await this.verifyAccountRepository.verify(params);
    return {
      verified,
    };
  }
}
