import { UpdateActiveChallenge } from '@/domain/usecases/challenge/update-active-challenge';
import { ListAccountOrders } from '@/domain/usecases/order';
import { ChallengeStrategy } from '@/presentation/interfaces';

export class BuyBackStrategy implements ChallengeStrategy {
  constructor(private readonly updateActiveChallenge: UpdateActiveChallenge, private readonly listAccountOrders: ListAccountOrders) {}

  async handle({ challenge, orderInfos }: ChallengeStrategy.Params): Promise<ChallengeStrategy.Result> {
    const { businessId } = orderInfos;
    const orders = await this.listAccountOrders.listAccountOrders({
      accountId: challenge.accountId,
      type: 'buy',
    });

    const foundOrder = orders.find((order) => order.Business.id === businessId);

    const newProgress = foundOrder ? challenge.progress + orderInfos.items.length : challenge.progress;

    const newStatus = newProgress === challenge.challenge.goal ? 'COMPLETED' : 'PENDING';

    await this.updateActiveChallenge.updateActiveChallenge({
      activeChallengeId: challenge.id,
      progress: newProgress,
      status: newStatus,
    });

    return {
      status: newStatus,
    };
  }
}
