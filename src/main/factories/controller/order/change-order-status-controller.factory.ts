import { DbChangeOrderStatus } from '@/data/usecases/order';
import { OrderPrismaRepository } from '@/infra/db/prisma/order';
import { ChangeOrderStatusController } from '@/presentation/controller/order';
import { BaseController } from '@/presentation/protocols';

export const makeChangeOrderStatusControllerFactory = (): BaseController => {
  const getOrderByIdRepository = new OrderPrismaRepository();
  const updateOrderByIdRepository = new OrderPrismaRepository();

  const changeOrderStatus = new DbChangeOrderStatus(getOrderByIdRepository, updateOrderByIdRepository);

  return new ChangeOrderStatusController(changeOrderStatus);
};
