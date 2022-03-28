import { VerifyAccount } from '@/domain/usecases/account/verify-account';
import { EmailVerification } from '@/data/protocols/email/email-verification';

export class EmailVerifyAccount implements VerifyAccount {
  constructor(
    private readonly emailVerification: EmailVerification,
  ) {}

  verify(params: VerifyAccount.Params): Promise<VerifyAccount.Result> {
    return Promise.resolve({
      verified: true,
    });
  }
}
