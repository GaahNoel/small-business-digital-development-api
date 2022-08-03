import { DbListAccountOrders } from '@/data/usecases/order';
import { OrderPrismaRepository } from '@/infra/db/prisma/order';
import { ListAccountOrdersController } from '@/presentation/controller/order';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeListAccountOrders = (): BaseController => {
  const listAccountOrdersRepository = new OrderPrismaRepository();

  const listAccountOrders = new DbListAccountOrders(listAccountOrdersRepository);

  return new ErrorHandlerDecorator(new ListAccountOrdersController(listAccountOrders));
};
