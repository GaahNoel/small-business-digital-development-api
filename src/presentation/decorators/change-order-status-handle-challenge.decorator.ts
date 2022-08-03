import { AddAccountBalance } from '@/domain/usecases/account/add-account-balance';
import { ChallengeInfos, GetAccountChallenges } from '@/domain/usecases/challenge';
import { GetOrderById } from '@/domain/usecases/order';
import { ChangeOrderStatusController, ChangeOrderStatusControllerParams } from '@/presentation/controller/order';
import { internalServerError } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';
import {
  BuyBackStrategy, BuyOrSellAnyOnlyProductOrServiceStrategy, BuyOrSellAnyStrategy, BuyProximityStrategy,
} from '@/presentation/strategies/';

namespace ChangeOrderStatusHandleChallengeDecorator {
  export type Params = ChangeOrderStatusControllerParams;
  export type Result = HttpResponse;
}

export class ChangeOrderStatusHandleChallengeDecorator implements BaseController {
  private strategies;

  constructor(
    private readonly controller: BaseController,
    private readonly getOrderById: GetOrderById,
    private readonly getAccountChallenges: GetAccountChallenges,
    private readonly addAccountBalance: AddAccountBalance,
    private readonly buyOrSellAnyStrategy: BuyOrSellAnyStrategy,
    private readonly buyOrSellAnyOnlyProductOrService: BuyOrSellAnyOnlyProductOrServiceStrategy,
    private readonly buyProximity: BuyProximityStrategy,
    private readonly buyBack: BuyBackStrategy,
  ) {
    this.strategies = {
      buyAny: this.buyOrSellAnyStrategy,
      sellAny: this.buyOrSellAnyStrategy,
      buyProduct: this.buyOrSellAnyOnlyProductOrService,
      buyService: this.buyOrSellAnyOnlyProductOrService,
      sellProduct: this.buyOrSellAnyOnlyProductOrService,
      sellService: this.buyOrSellAnyOnlyProductOrService,
      buyProximity: this.buyProximity,
      buyback: this.buyBack,
    };
  }

  async handle(data: ChangeOrderStatusHandleChallengeDecorator.Params): Promise<ChangeOrderStatusHandleChallengeDecorator.Result> {
    try {
      const response = await this.controller.handle(data);
      if (response.body.status !== 'COMPLETED') {
        return response;
      }

      const orderInfos = await this.getOrderById.getOrderById({
        orderId: data.orderId,
      });

      const { buyerId, sellerId } = orderInfos;

      const buyerChallenges = await this.getChallenges(buyerId, 'buy');
      const sellerChallenges = await this.getChallenges(sellerId, 'sell');

      const activeChallenges = [...sellerChallenges, ...buyerChallenges];

      const mappedChallenges = await Promise.all(activeChallenges.map(async (challenge) => {
        const strategy = this.strategies[challenge.challenge.type];

        if (!strategy) {
          return null;
        }

        const result = await strategy.handle({
          challenge,
          orderInfos,
        });
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

  private async getChallenges(id: string, type: 'buy' | 'sell'): Promise<ChallengeInfos[]> {
    const { challenges } = await this.getAccountChallenges.getAccountChallenges({
      accountId: id,
    });

    return challenges.filter((challenge) => challenge.status === 'PENDING' && challenge.challenge.type.includes(type));
  }
}
