import { UpdateActiveChallengeRepository } from '@/data/protocols/db/challenge/update-active-challenge.repository';
import { UpdateActiveChallenge } from '@/domain/usecases/challenge/update-active-challenge';

export class DbUpdateActiveChallenge implements UpdateActiveChallenge {
  constructor(private readonly updateActiveChallengeRepository: UpdateActiveChallengeRepository) {}

  async updateActiveChallenge(params: UpdateActiveChallenge.Params): Promise<UpdateActiveChallenge.Result> {
    return this.updateActiveChallengeRepository.updateActiveChallenge(params);
  }
}
