import { DbListBusinessById } from '@/data/usecases/business/db-list-business-by-id';
import { DbListAccountOrders } from '@/data/usecases/order';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { OrderPrismaRepository } from '@/infra/db/prisma/order';
import { ListAccountOrdersController } from '@/presentation/controller/order';
import { BaseController } from '@/presentation/protocols';

export const makeListAccountOrders = (): BaseController => {
  const listAccountOrdersRepository = new OrderPrismaRepository();
  const listBusinessByIdRepository = new BusinessPrismaRepository();

  const listBusinessById = new DbListBusinessById(listBusinessByIdRepository);
  const listAccountOrders = new DbListAccountOrders(listAccountOrdersRepository);

  return new ListAccountOrdersController(listAccountOrders, listBusinessById);
};
