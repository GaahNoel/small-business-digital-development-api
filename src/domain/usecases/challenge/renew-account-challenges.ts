type RenewAccountChallengesParams = {
  accountId: string;
  periodicity: 'daily' | 'weekly';
};

export namespace RenewAccountChallenges {
  export type Params = RenewAccountChallengesParams;
  export type Result = {
    challenges: Array<{
      id: string;
    }>;
  };
}

export interface RenewAccountChallenges {
  renew(params: RenewAccountChallenges.Params): Promise<RenewAccountChallenges.Result>
}
