import { DBGetAccountById } from '@/data';
import { DbRenewAccountChallenges } from '@/data/usecases/challenge';
import { AccountPrismaRepository } from '@/infra';
import { ChallengePrismaRepository } from '@/infra/db/prisma/challenge';
import { RenewAccountChallengesController } from '@/presentation/controller/challenge';

export const makeRenewAccountChallengesController = (): RenewAccountChallengesController => {
  const getAccountByIdRepository = new AccountPrismaRepository();
  const setAccountChallengesRepository = new ChallengePrismaRepository();
  const getChallengeByIndexRepository = new ChallengePrismaRepository();
  const getTotalCountRepository = new ChallengePrismaRepository();

  const renewAccountChallenges = new DbRenewAccountChallenges(getTotalCountRepository, getChallengeByIndexRepository, setAccountChallengesRepository);
  const getAccountById = new DBGetAccountById(getAccountByIdRepository);

  return new RenewAccountChallengesController(renewAccountChallenges, getAccountById);
};
