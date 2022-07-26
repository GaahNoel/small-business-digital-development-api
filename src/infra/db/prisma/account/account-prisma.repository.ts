import { AddAccountRepository } from '@/data';
import { FindAccountByEmailRepository, GetAccountByIdRepository, VerifyAccountRepository } from '@/data/protocols/db/account';
import { EditAccountRepository } from '@/data/protocols/db/account/edit-account.repository';
import { GetAllAccountIdsRepository } from '@/data/protocols/db/challenge';
import { prisma } from '@/infra/db/helpers';

export class AccountPrismaRepository implements
  AddAccountRepository,
  FindAccountByEmailRepository,
  VerifyAccountRepository,
  EditAccountRepository,
  GetAccountByIdRepository,
  GetAllAccountIdsRepository {
  async add(data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const result = await prisma.account.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        provider: data.provider,
        verified: data.verified ?? false,
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

  async getById(params: GetAccountByIdRepository.Params): Promise<GetAccountByIdRepository.Result> {
    const result = await prisma.account.findFirst({
      where: {
        id: params.accountId,
      },
    });
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      verified: result.verified,
      provider: result.provider,
    };
  }

  async getAllAccountIds(): Promise<GetAllAccountIdsRepository.Result> {
    const accountIds = await prisma.account.findMany({
      select: {
        id: true,
      },
    });

    return {
      accountIds: accountIds.map((account) => account.id),
    };
  }
}
