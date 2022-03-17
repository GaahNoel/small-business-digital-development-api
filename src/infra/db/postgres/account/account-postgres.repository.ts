import { AddAccountRepository, prisma } from './account-postgres.repository.protocols';

export class AccountPostgresRepository implements AddAccountRepository {
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
}
