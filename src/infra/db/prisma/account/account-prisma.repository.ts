import { AddAccountRepository } from '@/data';
import { FindAccountByEmailRepository } from '@/data/protocols/db/account/find-account-by-email-repository';
import { VerifyAccountRepository } from '@/data/protocols/db/account/verify-account-repository';
import { prisma } from '@/infra/db/helpers';

export class AccountPrismaRepository implements AddAccountRepository, FindAccountByEmailRepository, VerifyAccountRepository {
  async add(data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const result = await prisma.account.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
    return {
      id: result.id,
    };
  }

  async findByEmail({ email }: FindAccountByEmailRepository.Params): Promise<FindAccountByEmailRepository.Result> {
    const result = await prisma.account.findFirst({
      where: {
        email,
      },
    });
    return result;
  }

  async verify(id: string): Promise<boolean> {
    const result = await prisma.account.update({
      where: {
        id,
      },
      data: {
        verified: true,
      },
    });
    return result.verified;
  }
}
