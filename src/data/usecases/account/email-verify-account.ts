import { Decrypter } from '@/data/protocols/cryptography';
import { VerifyAccountRepository } from '@/data/protocols/db/account';
import { VerifyAccount } from '@/domain/usecases/account/verify-account';

export class EmailVerifyAccount implements VerifyAccount {
  constructor(private readonly verifyAccountRepository: VerifyAccountRepository, private readonly decrypter: Decrypter) {}

  async verify(params: VerifyAccount.Params): Promise<VerifyAccount.Result> {
    const decryptedEmail = await this.decrypter.decrypt(params);
    const verified = await this.verifyAccountRepository.verify(decryptedEmail);
    return {
      verified,
    };
  }
}
