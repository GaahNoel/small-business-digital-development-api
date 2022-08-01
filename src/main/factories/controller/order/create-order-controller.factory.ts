import { DBGetAccountById } from '@/data';
import { DbListBusinessById } from '@/data/usecases/business/db-list-business-by-id';
import { DbCreateOrder } from '@/data/usecases/order';
import { AccountPrismaRepository } from '@/infra';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { OrderPrismaRepository } from '@/infra/db/prisma/order';
import { ProductPrismaRepository } from '@/infra/db/prisma/product';
import { NodeMailerAdapter } from '@/infra/email/nodemailer-adapter';
import { env } from '@/main/config/env';
import { CreateOrderController } from '@/presentation/controller/order';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeCreateOrderController = (): BaseController => {
  const createOrderRepository = new OrderPrismaRepository();
  const getAccountByIdRepository = new AccountPrismaRepository();
  const listBusinessByIdRepository = new BusinessPrismaRepository();
  const getProductByIdRepository = new ProductPrismaRepository();

  const getAccountById = new DBGetAccountById(getAccountByIdRepository);
  const listBusinessById = new DbListBusinessById(listBusinessByIdRepository);
  const emailVerificationSender = new NodeMailerAdapter(
    env.emailAccount,
    env.emailAccount,
    env.emailPassword,
    'smtp.gmail.com',
    465,
    true,
  );

  const createOrder = new DbCreateOrder(createOrderRepository, listBusinessByIdRepository, getProductByIdRepository);

  const controller = new ErrorHandlerDecorator(new CreateOrderController(createOrder, getAccountById, listBusinessById, emailVerificationSender));
  return controller;
};
