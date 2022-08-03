import { GetAccountChallenges } from '@/domain/usecases/challenge/get-account-challenges';

export interface GetAccountChallengeRepository {
  getAccountChallenges(params: GetAccountChallenges.Params): Promise<GetAccountChallenges.Result>
}
