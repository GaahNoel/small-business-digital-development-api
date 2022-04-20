import { AddAccountRepository } from '@/data';
import { FindAccountByEmailRepository, VerifyAccountRepository } from '@/data/protocols/db/account';
import { EditAccountRepository } from '@/data/protocols/db/account/edit-account.repository';
import { prisma } from '@/infra/db/helpers';

export class AccountPrismaRepository implements AddAccountRepository, FindAccountByEmailRepository, VerifyAccountRepository, EditAccountRepository {
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

  async edit(data: EditAccountRepository.Params): Promise<EditAccountRepository.Result> {
    const result = await prisma.account.update({
      where: {
        id: data.id,
      },
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
}
