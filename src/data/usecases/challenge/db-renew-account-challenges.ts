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
      periodicity: 'daily',
    });

    const weeklyChallengesTotal = await this.getChallengeTotalCount.getTotalCount({
      periodicity: 'weekly',
    });

    const randomDailyIndexes = [];
    const randomWeeklyIndexes = [];

    for (let i = 0; i < 2; i += 1) {
      randomDailyIndexes.push(Math.floor(Math.random() * dailyChallengesTotal.total));
    }

    for (let i = 0; i < 2; i += 1) {
      randomWeeklyIndexes.push(Math.floor(Math.random() * weeklyChallengesTotal.total));
    }

    const dailyChallenges = await Promise.all(
      randomDailyIndexes.map(async (index) => {
        const challenge = await this.getChallengeByIndex.getByIndex({ challengeIndex: index });
        return challenge;
      }),
    );

    const weeklyChallenges = await Promise.all(
      randomWeeklyIndexes.map(async (index) => {
        const challenge = await this.getChallengeByIndex.getByIndex({ challengeIndex: index });
        return challenge;
      }),
    );

    const challenges = [...dailyChallenges, ...weeklyChallenges];

    await this.setAccountChallengesRepository.setAccountChallenges({
      accountId: params.accountId,
      challenges,
    });

    return { challenges };
  }
}
