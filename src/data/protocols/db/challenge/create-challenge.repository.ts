import { CreateChallenge } from '@/domain/usecases/challenge';

export namespace CreateChallengeRepository {
  export type Params = CreateChallenge.Params;
  export type Result = {
    challengeId: string
  };
}
export interface CreateChallengeRepository {
  create(params: CreateChallengeRepository.Params): Promise<CreateChallengeRepository.Result>;
}
