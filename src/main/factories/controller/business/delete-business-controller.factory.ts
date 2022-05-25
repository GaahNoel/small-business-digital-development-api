import { DbDeleteBusiness } from '@/data/usecases/business';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { DeleteBusinessController } from '@/presentation/controller/business';
import { BaseController } from '@/presentation/protocols';

export const makeDeleteBusinessController = (): BaseController => {
  const deleteBusinessRepository = new BusinessPrismaRepository();

  const dbDeleteBusiness = new DbDeleteBusiness(deleteBusinessRepository);

  return new DeleteBusinessController(dbDeleteBusiness);
};
