import { GetChallengeByIndexRepository } from '@/data/protocols/db/challenge/get-challenge-by-index.repository';
import { GetChallengeTotalCountRepository } from '@/data/protocols/db/challenge/get-challenge-total-count.repository';
import { SetAccountChallengesRepository } from '@/data/protocols/db/challenge/set-account-challenges.repository';
import { RenewAccountChallenges } from '@/domain/usecases/challenge/renew-account-challenges';

export class DbRenewAccountChallenges implements RenewAccountChallenges {
  constructor(
    private readonly getChallengeTotalCount: GetChallengeTotalCountRepository,
    private readonly getChallengeByIndex: GetChallengeByIndexRepository,
    private readonly setAccountChallengesRepository: SetAccountChallengesRepository,
  ) {}

  async renew(params: RenewAccountChallenges.Params): Promise<RenewAccountChallenges.Result> {
    const dailyChallengesTotal = await this.getChallengeTotalCount.getTotalCount({
      periodicity: params.periodicity,
    });

    const randomIndexes = [];

    for (let i = 0; i < 2; i += 1) {
      randomIndexes.push(Math.floor(Math.random() * dailyChallengesTotal.total));
    }

    const challenges = await Promise.all(
      randomIndexes.map(async (index) => {
        const challenge = await this.getChallengeByIndex.getByIndex({ challengeIndex: index });
        return challenge;
      }),
    );

    await this.setAccountChallengesRepository.setAccountChallenges({
      accountId: params.accountId,
      challenges,
    });

    return { challenges };
  }
}
