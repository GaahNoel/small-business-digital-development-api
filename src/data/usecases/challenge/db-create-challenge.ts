import { CreateChallengeRepository } from '@/data/protocols/db/challenge/create-challenge.repository';
import { CreateChallenge } from '@/domain/usecases/challenge';

export class DbCreateChallenge implements CreateChallenge {
  constructor(private readonly createChallengeRepository: CreateChallengeRepository) {}

  async create(params: CreateChallenge.Params): Promise<CreateChallenge.Result> {
    const createdChallenge = await this.createChallengeRepository.create({
      description: params.description,
      type: params.type,
      goal: params.goal,
      periodicity: params.periodicity,
      reward: params.reward,
    });

    return {
      challengeId: createdChallenge.challengeId,
    };
  }
}
