import { DbAddAccountBalance } from '@/data';
import { DbListBusinessById } from '@/data/usecases/business/db-list-business-by-id';
import { DbUpdateActiveChallenge } from '@/data/usecases/challenge';
import { DbChangeOrderStatus, DbGetOrderById, DbListAccountOrders } from '@/data/usecases/order';
import { AccountPrismaRepository } from '@/infra';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { ChallengePrismaRepository } from '@/infra/db/prisma/challenge';
import { OrderPrismaRepository } from '@/infra/db/prisma/order';
import { NodeMailerAdapter } from '@/infra/email/nodemailer-adapter';
import { env } from '@/main/config/env';
import { ChangeOrderStatusController } from '@/presentation/controller/order';
import { ChangeOrderStatusHandleChallengeDecorator, ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';
import {
  BuyBackStrategy, BuyOrSellAnyOnlyProductOrServiceStrategy, BuyOrSellAnyStrategy, BuyProximityStrategy,
} from '@/presentation/strategies';

export const makeChangeOrderStatusControllerFactory = (): BaseController => {
  const orderRepository = new OrderPrismaRepository();
  const accountRepository = new AccountPrismaRepository();
  const updateOrderByIdRepository = new OrderPrismaRepository();
  const challengeRepository = new ChallengePrismaRepository();
  const businessRepository = new BusinessPrismaRepository();

  const EmailVerificationSender = new NodeMailerAdapter(
    env.emailAccount,
    env.emailAccount,
    env.emailPassword,
    'smtp.gmail.com',
    465,
    true,
  );

  const changeOrderStatus = new DbChangeOrderStatus(orderRepository, updateOrderByIdRepository, accountRepository, EmailVerificationSender);
  const updateActiveChallenge = new DbUpdateActiveChallenge(challengeRepository);
  const getOrderById = new DbGetOrderById(orderRepository);
  const getBusinessById = new DbListBusinessById(businessRepository);
  const listAccountOrders = new DbListAccountOrders(orderRepository);
  const addAccountBalance = new DbAddAccountBalance(accountRepository, accountRepository);

  const changeOrderStatusController = new ErrorHandlerDecorator(new ChangeOrderStatusController(changeOrderStatus));

  const buyOrSellAnyStrategy = new BuyOrSellAnyStrategy(updateActiveChallenge);
  const buyOrSellOnlyStrategy = new BuyOrSellAnyOnlyProductOrServiceStrategy(updateActiveChallenge);
  const buyProximity = new BuyProximityStrategy(updateActiveChallenge, getBusinessById);
  const buyBack = new BuyBackStrategy(updateActiveChallenge, listAccountOrders);

  return new ChangeOrderStatusHandleChallengeDecorator(
    changeOrderStatusController,
    getOrderById,
    challengeRepository,
    addAccountBalance,
    buyOrSellAnyStrategy,
    buyOrSellOnlyStrategy,
    buyProximity,
    buyBack,
  );
};
