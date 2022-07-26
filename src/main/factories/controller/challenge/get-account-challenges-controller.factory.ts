import { DbGetAccountChallenges } from '@/data/usecases/challenge';
import { ChallengePrismaRepository } from '@/infra/db/prisma/challenge';
import { GetAccountChallengesController } from '@/presentation/controller/challenge';
import { BaseController } from '@/presentation/protocols';

export const makeGetAccountChallengesController = (): BaseController => {
  const getAccountChallengeRepository = new ChallengePrismaRepository();

  const getAccountChallenges = new DbGetAccountChallenges(getAccountChallengeRepository);

  return new GetAccountChallengesController(getAccountChallenges);
};
