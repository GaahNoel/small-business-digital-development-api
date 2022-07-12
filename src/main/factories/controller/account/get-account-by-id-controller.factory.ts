import { DBGetAccountById } from '@/data';
import { AccountPrismaRepository } from '@/infra';
import { GetAccountByIdController } from '@/presentation/controller/account';
import { BaseController } from '@/presentation/protocols';

export const makeGetAccountByIdController = (): BaseController => {
  const getAccountByIdRepository = new AccountPrismaRepository();

  const getAccountById = new DBGetAccountById(getAccountByIdRepository);

  return new GetAccountByIdController(getAccountById);
};
