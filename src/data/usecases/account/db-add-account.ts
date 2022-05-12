import { AddAccountRepository, FindAccountByEmailRepository } from '@/data/protocols';
import { Encrypter, Hasher } from '@/data/protocols/cryptography';
import { EmailVerificationSender } from '@/data/protocols/email/email-verification-sender';
import { AddAccount } from '@/domain/usecases/account';
import { makeVerifyAccountMessage } from '@/utils/email-messages/verify-account-message';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly addAccountRepository: AddAccountRepository,
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly emailVerificationSender: EmailVerificationSender,
    private readonly hasher: Hasher,
    private readonly encrypter: Encrypter,
  ) { }

  async add(data: AddAccount.Params): Promise<AddAccount.Result> {
    const { email, password } = data;
    const accountAlreadyExists = await this.findAccountByEmailRepository.findByEmail({
      email,
    });

    if (accountAlreadyExists) {
      return {
        id: accountAlreadyExists.id,
        created: false,
      };
    }

    const hashedPassword = password ? await this.hasher.hash(password) : '';

    const isDefaultVerified = data.provider !== 'credentials';

    const result = await this.addAccountRepository.add({
      ...data,
      password: hashedPassword,
      verified: isDefaultVerified,
    });

    if (data.password) {
      const encryptedId = await this.encrypter.encrypt(result.id);
      this.emailVerificationSender.send({
        toEmail: email,
        subject: 'Verification email',
        message: makeVerifyAccountMessage(data.name, encryptedId),
      });
    }

    return {
      id: result.id,
      created: true,
    };
  }
}
