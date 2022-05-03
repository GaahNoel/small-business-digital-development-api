import { AddAccountRepository } from '@/data/protocols';
import { Hasher } from '@/data/protocols/cryptography';
import { FindAccountByEmailRepository } from '@/data/protocols/db/account';
import { FindAccountByEmailAndProviderRepository } from '@/data/protocols/db/account/find-account-by-email-and-provider.repository';
import { EmailVerificationSender } from '@/data/protocols/email/email-verification-sender';
import { AddAccount } from '@/domain/usecases/account';
import { makeVerifyAccountMessage } from '@/utils/email-messages/verify-account-message';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly addAccountRepository: AddAccountRepository,
    private readonly findAccountByEmailAndProviderRepository: FindAccountByEmailAndProviderRepository,
    private readonly emailVerificationSender: EmailVerificationSender,
    private readonly hasher: Hasher,
  ) {}

  async add(data: AddAccount.Params): Promise<AddAccount.Result> {
    const { email, password, provider } = data;
    const accountAlreadyExists = await this.findAccountByEmailAndProviderRepository.findByEmailAndProvider({
      email,
      provider,
    });

    if (accountAlreadyExists) {
      return {
        id: accountAlreadyExists.id,
        created: false,
      };
    }

    const hashedPassword = password ? await this.hasher.hash(password) : '';

    const result = await this.addAccountRepository.add({
      ...data,
      password: hashedPassword,
    });

    if (data.password) {
      this.emailVerificationSender.send({
        toEmail: email,
        subject: 'Verification email',
        message: makeVerifyAccountMessage(data.name),
      });
    }

    return {
      id: result.id,
      created: true,
    };
  }
}
