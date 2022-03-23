import { AddAccountRepository } from '@/data';
import { prisma } from '@/infra/db/helpers';

export class AccountPrismaRepository implements AddAccountRepository {
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
      ...data,
    };
  }

  async findByEmail(email: string): Promise<AddAccountRepository.Result> {
    const result = await prisma.account.findFirst({
      where: {
        email,
      },
    });
    return result;
  }
}
