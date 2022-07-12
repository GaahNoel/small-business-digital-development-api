import { DbCreateOrder } from '@/data/usecases/order';
import { OrderPrismaRepository } from '@/infra/db/prisma/order';
import { CreateOrderController } from '@/presentation/controller/order';
import { BaseController } from '@/presentation/protocols';

export const makeCreateOrderController = (): BaseController => {
  const createOrderRepository = new OrderPrismaRepository();

  const createOrder = new DbCreateOrder(createOrderRepository);

  const controller = new CreateOrderController(createOrder);
  return controller;
};
