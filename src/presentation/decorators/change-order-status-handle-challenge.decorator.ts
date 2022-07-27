import { Challenges, GetAccountChallenges } from '@/domain/usecases/challenge';
import { GetOrderById } from '@/domain/usecases/order';
import { ChangeOrderStatusController, ChangeOrderStatusControllerParams } from '../controller/order';
import { internalServerError } from '../helpers/http.helpers';
import { BaseController, HttpResponse } from '../protocols';
import { BuyAnyStrategy } from '../strategies/buy-any.strategy';
import { SellAnyStrategy } from '../strategies/sell-any.strategy';

export interface AddAccountBalance {
  addBalance({ accountId, balance }: { accountId: string, balance: number }): Promise<void>;
}

namespace ChangeOrderStatusHandleChallengeDecorator {
  export type Params = ChangeOrderStatusControllerParams;
  export type Result = HttpResponse;
}

export class ChangeOrderStatusHandleChallengeDecorator implements BaseController {
  private strategies;

  constructor(
    private readonly controller: ChangeOrderStatusController,
    private readonly getOrderById: GetOrderById,
    private readonly getAccountChallenges: GetAccountChallenges,
    private readonly addAccountBalance: AddAccountBalance,
    private readonly buyAnyStrategy: BuyAnyStrategy,
    private readonly sellAnyStrategy: SellAnyStrategy,
  ) {
    this.strategies = {
      buyAny: this.buyAnyStrategy,
      sellAny: this.sellAnyStrategy,
    };
  }

  async handle(data: ChangeOrderStatusHandleChallengeDecorator.Params): Promise<ChangeOrderStatusHandleChallengeDecorator.Result> {
    try {
      const response = await this.controller.handle(data);
      if (response.body.status !== 'COMPLETED') {
        return response;
      }

      const { buyerId, sellerId } = await this.getOrderById.getOrderById({
        orderId: data.orderId,
      });

      const buyerChallenges = await this.getChallenges(buyerId, 'buy');
      const sellerChallenges = await this.getChallenges(sellerId, 'sell');

      const activeChallenges = [...sellerChallenges, ...buyerChallenges];

      const mappedChallenges = await Promise.all(activeChallenges.map(async (challenge) => {
        const strategy = this.strategies[challenge.challenge.type];

        if (!strategy) {
          return null;
        }

        const result = await strategy.handle(data);
        return {
          ...challenge,
          status: result.status,
        };
      }));

      const finalizedChallenges = mappedChallenges.filter((mappedChallenge) => {
        if (mappedChallenge && mappedChallenge.status === 'COMPLETED') {
          return true;
        }
        return false;
      });

      const additionalBuyerBalance = finalizedChallenges.reduce((acc, challenge) => {
        if (challenge.accountId === buyerId) {
          return acc + challenge.challenge.reward;
        }
        return acc;
      }, 0);

      const additionalSellerBalance = finalizedChallenges.reduce((acc, challenge) => {
        if (challenge.accountId === sellerId) {
          return acc + challenge.challenge.reward;
        }
        return acc;
      }, 0);

      await this.addAccountBalance.addBalance({
        accountId: buyerId,
        balance: additionalBuyerBalance,
      });

      await this.addAccountBalance.addBalance({
        accountId: sellerId,
        balance: additionalSellerBalance,
      });

      return response;
    } catch (error) {
      return internalServerError(error);
    }
  }

  private async getChallenges(id: string, type: 'buy' | 'sell'): Promise<Challenges> {
    const { challenges } = await this.getAccountChallenges.getAccountChallenges({
      accountId: id,
    });

    return challenges.filter((challenge) => challenge.status === 'PENDING' && challenge.challenge.type.includes(type));
  }
}
