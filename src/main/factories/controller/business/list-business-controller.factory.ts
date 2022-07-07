import { DbListBusiness } from '@/data/usecases/business';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { ListBusinessController } from '@/presentation/controller/business';

export const makeListBusinessController = (): ListBusinessController => {
  const listBusinessRepository = new BusinessPrismaRepository();
  const listBusiness = new DbListBusiness(listBusinessRepository);
  return new ListBusinessController(listBusiness);
};
