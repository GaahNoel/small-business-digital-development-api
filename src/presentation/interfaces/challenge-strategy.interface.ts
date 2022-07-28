import { ChallengeInfos } from '@/domain/usecases/challenge';
import { GetOrderById } from '@/domain/usecases/order';

type ChallengeStrategyResult = {
  status: 'PENDING' | 'COMPLETED'
};
export type ChallengeData = {
  challenge: ChallengeInfos;
  orderInfos: GetOrderById.Result
};
export namespace ChallengeStrategy {
  export type Result = ChallengeStrategyResult;
  export type Params = ChallengeData;
}

export interface ChallengeStrategy {
  handle(data: ChallengeData): Promise<ChallengeStrategyResult>
}
