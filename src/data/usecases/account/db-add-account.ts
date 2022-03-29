import { AddAccountRepository } from '@/data/protocols';
import { Hasher } from '@/data/protocols/cryptography';
import { FindAccountByEmailRepository } from '@/data/protocols/db/account/find-account-by-email-repository';
import { AddAccount } from '@/domain/usecases';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly addAccountRepository: AddAccountRepository,
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository,
    private readonly hasher: Hasher,
  ) {}

  async add(data: AddAccount.Params): Promise<AddAccount.Result> {
    const accountAlreadyExists = await this.findAccountByEmailRepository.findByEmail({
      email: data.email,
    });

    if (accountAlreadyExists) {
      return null;
    }

    const hashedPassword = await this.hasher.hash(data.password);

    const result = await this.addAccountRepository.add({
      ...data,
      password: hashedPassword,
    });

    return {
      id: result.id,
    };
  }
}
