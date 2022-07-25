import { CreateChallengeRepository } from '@/data/protocols/db/challenge/create-challenge.repository';
import { prisma } from '../../helpers';

export class ChallengePrismaRepository implements CreateChallengeRepository {
  async create(params: CreateChallengeRepository.Params): Promise<CreateChallengeRepository.Result> {
    const createdChallenge = await prisma.challenge.create({
      data: {
        description: params.description,
        type: params.type,
        goal: params.goal,
        periodicity: params.periodicity,
        reward: params.reward,
      },
    });

    return {
      challengeId: createdChallenge.id,
    };
  }
}
