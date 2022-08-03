import { DbCreateChallenge } from '@/data/usecases/challenge';
import { ChallengePrismaRepository } from '@/infra/db/prisma/challenge';
import { CreateChallengeController } from '@/presentation/controller/challenge';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeCreateChallengeController = (): BaseController => {
  const createChallengeRepository = new ChallengePrismaRepository();

  const createChallenge = new DbCreateChallenge(createChallengeRepository);

  return new ErrorHandlerDecorator(new CreateChallengeController(createChallenge));
};
