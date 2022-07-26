import {
  ChallengeType, Periodicity,
} from '@/domain/models/challenge';

type GetAccountChallengesParams = {
  accountId: string;
};

export namespace GetAccountChallenges {
  export type Params = GetAccountChallengesParams;
  export type Result = {
    challenges: {
      id: string;
      challenge: {
        id: string;
        description: string;
        type: ChallengeType;
        goal: number;
        periodicity: Periodicity;
        reward: number;
        createdAt?: Date
        updatedAt ?: Date
      };
      accountId: string;
      progress: number;
      status: 'PENDING' | 'COMPLETED'
      createdAt?: Date
      updatedAt ?: Date
    }[];
  };
}

export interface GetAccountChallenges {
  getAccountChallenges(params: GetAccountChallenges.Params): Promise<GetAccountChallenges.Result>
}
