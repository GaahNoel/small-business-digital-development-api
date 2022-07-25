import { GetChallengeByIndexRepository, GetChallengeTotalCountRepository } from '@/data/protocols/db/challenge';
import { CreateChallengeRepository } from '@/data/protocols/db/challenge/create-challenge.repository';
import { SetAccountChallengesRepository } from '@/data/protocols/db/challenge/set-account-challenges.repository';
import { prisma } from '../../helpers';

export class ChallengePrismaRepository implements CreateChallengeRepository, GetChallengeByIndexRepository, GetChallengeTotalCountRepository, SetAccountChallengesRepository {
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

  async getTotalCount(): Promise<GetChallengeTotalCountRepository.Result> {
    const total = await prisma.challenge.count();
    return {
      total,
    };
  }

  async getByIndex(params: GetChallengeByIndexRepository.Params): Promise<GetChallengeByIndexRepository.Result> {
    const challenge = await prisma.challenge.findFirst({
      skip: params.challengeIndex,
    });

    return challenge;
  }

  async setAccountChallenges(params: SetAccountChallengesRepository.Params): Promise<void> {
    await prisma.activeChallenge.deleteMany({
      where: {
        accountId: params.accountId,
      },
    });

    await prisma.activeChallenge.createMany({
      data: params.challenges.map((challenge) => ({
        accountId: params.accountId,
        challengeId: challenge.id,
      })),
    });
  }
}
