import { Decrypter } from '@/data/protocols/cryptography';
import { VerifyAccountRepository } from '@/data/protocols/db/account';
import { VerifyAccount } from '@/domain/usecases/account/verify-account';

export class EmailVerifyAccount implements VerifyAccount {
  constructor(private readonly verifyAccountRepository: VerifyAccountRepository, private readonly decrypter: Decrypter) { }

  async verify(params: VerifyAccount.Params): Promise<VerifyAccount.Result> {
    const decryptedParams = await this.decrypter.decrypt(params) as any;
    console.log(decryptedParams);
    const verified = await this.verifyAccountRepository.verify(decryptedParams.id);
    return {
      verified,
    };
  }
}
