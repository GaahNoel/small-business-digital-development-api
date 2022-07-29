import { DbUpdateActiveChallenge } from '@/data/usecases/challenge';
import { DbChangeOrderStatus, DbGetOrderById } from '@/data/usecases/order';
import { AccountPrismaRepository } from '@/infra';
import { ChallengePrismaRepository } from '@/infra/db/prisma/challenge';
import { OrderPrismaRepository } from '@/infra/db/prisma/order';
import { NodeMailerAdapter } from '@/infra/email/nodemailer-adapter';
import { env } from '@/main/config/env';
import { ChangeOrderStatusController } from '@/presentation/controller/order';
import { ChangeOrderStatusHandleChallengeDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';
import { BuyOrSellAnyOnlyProductOrService, BuyOrSellAnyStrategy } from '@/presentation/strategies';

export const makeChangeOrderStatusControllerFactory = (): BaseController => {
  const getOrderByIdRepository = new OrderPrismaRepository();
  const accountRepository = new AccountPrismaRepository();
  const updateOrderByIdRepository = new OrderPrismaRepository();
  const challengeRepository = new ChallengePrismaRepository();

  const EmailVerificationSender = new NodeMailerAdapter(
    env.emailAccount,
    env.emailAccount,
    env.emailPassword,
    'smtp.gmail.com',
    465,
    true,
  );

  const changeOrderStatus = new DbChangeOrderStatus(getOrderByIdRepository, updateOrderByIdRepository, accountRepository, EmailVerificationSender);
  const updateActiveChallenge = new DbUpdateActiveChallenge(challengeRepository);
  const getOrderById = new DbGetOrderById(getOrderByIdRepository);

  const changeOrderStatusController = new ChangeOrderStatusController(changeOrderStatus);

  const buyOrSellAnyStrategy = new BuyOrSellAnyStrategy(updateActiveChallenge);
  const buyOrSellOnlyStrategy = new BuyOrSellAnyOnlyProductOrService(updateActiveChallenge);

  return new ChangeOrderStatusHandleChallengeDecorator(changeOrderStatusController, getOrderById, challengeRepository, accountRepository, buyOrSellAnyStrategy, buyOrSellOnlyStrategy);
};
