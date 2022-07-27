import { ChangeOrderStatusControllerParams } from '../controller/order';
import { ChallengeStrategy } from '@/presentation/interfaces';

export class SellAnyStrategy implements ChallengeStrategy<ChangeOrderStatusControllerParams> {
  async handle(params: ChangeOrderStatusControllerParams): Promise<ChallengeStrategy.Result> {
    return Promise.resolve({ status: 'COMPLETED' });
  }
}
