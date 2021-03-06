export namespace SetAccountChallengesRepository {
  export type Params = {
    accountId: string;
    challenges: Array<{
      id: string;
    }>;
    periodicity: 'daily' | 'weekly';
  };
  export type Result = void;
}
export interface SetAccountChallengesRepository {
  setAccountChallenges(params: SetAccountChallengesRepository.Params): Promise<SetAccountChallengesRepository.Result>
}
