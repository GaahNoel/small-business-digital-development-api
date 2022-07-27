import { ChangeOrderStatusControllerParams } from '../controller/order';
import { ChallengeStrategy } from '@/presentation/interfaces';

export class BuyAnyStrategy implements ChallengeStrategy<ChangeOrderStatusControllerParams> {
  async handle(params: ChangeOrderStatusControllerParams): Promise<ChallengeStrategy.Result> {
    return Promise.resolve({ status: 'COMPLETED' });
  }
}
