import { DbGetOrderById } from '@/data/usecases/order';
import { OrderPrismaRepository } from '@/infra/db/prisma/order';
import { GetOrderByIdController } from '@/presentation/controller/order';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeGetOrderByIdController = (): BaseController => {
  const getOrderByIdRepository = new OrderPrismaRepository();

  const getOrderById = new DbGetOrderById(getOrderByIdRepository);

  return new ErrorHandlerDecorator(new GetOrderByIdController(getOrderById));
};
