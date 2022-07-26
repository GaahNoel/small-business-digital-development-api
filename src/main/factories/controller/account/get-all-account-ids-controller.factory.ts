import { DbGetAllAccountIds } from '@/data';
import { AccountPrismaRepository } from '@/infra';
import { GetAllAccountIdsController } from '@/presentation/controller/account';
import { BaseController } from '@/presentation/protocols';

export const makeGetAllAccountIdsController = (): BaseController => {
  const getAllAccountIdsRepository = new AccountPrismaRepository();

  const getAllAccountIds = new DbGetAllAccountIds(getAllAccountIdsRepository);

  return new GetAllAccountIdsController(getAllAccountIds);
};
