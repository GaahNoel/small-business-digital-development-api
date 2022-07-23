import { DbChangeOrderStatus } from '@/data/usecases/order';
import { AccountPrismaRepository } from '@/infra';
import { OrderPrismaRepository } from '@/infra/db/prisma/order';
import { NodeMailerAdapter } from '@/infra/email/nodemailer-adapter';
import { env } from '@/main/config/env';
import { ChangeOrderStatusController } from '@/presentation/controller/order';
import { BaseController } from '@/presentation/protocols';

export const makeChangeOrderStatusControllerFactory = (): BaseController => {
  const getOrderByIdRepository = new OrderPrismaRepository();
  const getAccountByIdRepository = new AccountPrismaRepository();
  const updateOrderByIdRepository = new OrderPrismaRepository();
  const EmailVerificationSender = new NodeMailerAdapter(
    env.emailAccount,
    env.emailAccount,
    env.emailPassword,
    'smtp.gmail.com',
    465,
    true,
  );

  const changeOrderStatus = new DbChangeOrderStatus(getOrderByIdRepository, updateOrderByIdRepository, getAccountByIdRepository, EmailVerificationSender);

  return new ChangeOrderStatusController(changeOrderStatus);
};
