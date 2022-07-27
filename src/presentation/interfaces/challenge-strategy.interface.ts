type ChallengeStrategyResult = {
  status: 'PENDING' | 'COMPLETED'
};

export namespace ChallengeStrategy {
  export type Result = ChallengeStrategyResult;
}

export interface ChallengeStrategy<T> {
  handle(data: T): Promise<ChallengeStrategyResult>
}
