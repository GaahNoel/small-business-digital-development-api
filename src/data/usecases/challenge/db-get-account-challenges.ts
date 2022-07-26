import { GetAccountChallengeRepository } from '@/data/protocols/db/challenge/get-account-challenge.repository';
import { GetAccountChallenges } from '@/domain/usecases/challenge/get-account-challenges';
import { NotFound } from '@/presentation/errors';

export class DbGetAccountChallenges implements GetAccountChallenges {
  constructor(private readonly getAccountChallengeRepository: GetAccountChallengeRepository) {}

  async getAccountChallenges(params: GetAccountChallenges.Params): Promise<GetAccountChallenges.Result> {
    const { challenges } = await this.getAccountChallengeRepository.getAccountChallenges(params);

    if (challenges.length === 0) {
      throw new NotFound({
        entity: 'challenge',
      });
    }

    return { challenges };
  }
}
