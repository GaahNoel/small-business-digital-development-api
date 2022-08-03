import { ChallengeType, Periodicity } from '@/domain/models/challenge';

type CreateChallengeParams = {
  description: string;
  type: ChallengeType;
  goal: number;
  periodicity: Periodicity;
  reward: number;
};

export namespace CreateChallenge {
  export type Params = CreateChallengeParams;
  export type Result = {
    challengeId: string
  };
}

export interface CreateChallenge {
  create(params: CreateChallenge.Params): Promise<CreateChallenge.Result>;
}
