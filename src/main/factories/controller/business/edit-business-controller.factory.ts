import { DbEditBusiness } from '@/data/usecases/business';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { EditBusinessController } from '@/presentation/controller/business';
import { BaseController } from '@/presentation/protocols';

export const makeEditBusinessController = (): BaseController => {
  const editBusinessRepository = new BusinessPrismaRepository();

  const dbEditBusiness = new DbEditBusiness(editBusinessRepository);

  return new EditBusinessController(dbEditBusiness);
};
