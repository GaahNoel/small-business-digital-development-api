import { Challenge } from '@/domain/models/challenge';

export namespace GetChallengeByIndexRepository {
  export type Params = {
    challengeIndex: number;
    periodicity?: 'daily' | 'weekly'
  };

  export type Result = Challenge;
}

export interface GetChallengeByIndexRepository {
  getByIndex(params: GetChallengeByIndexRepository.Params): Promise<GetChallengeByIndexRepository.Result>;
}
