import { AddAccountRepository } from '@/data';
import { FindAccountByEmailRepository } from '@/data/protocols/db/account/find-account-by-email-repository';
import { prisma } from '@/infra/db/helpers';

export class AccountPrismaRepository implements AddAccountRepository, FindAccountByEmailRepository {
  async add(data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    console.log(data);
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
}
