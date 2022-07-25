import { mockCreateChallengeParams } from '@/tests/domain/mocks/challenge.mock';
import { ChallengePrismaRepository } from '@/infra/db/prisma/challenge';
import { prisma } from '@/infra/db/helpers';
import { mockAddAccountParams } from '@/tests/domain/mocks/account.mock';
import { AddAccountRepository } from '@/data';
import { AccountPrismaRepository } from '@/infra/db/prisma/account';

describe('ChallengePrismaRepository', () => {
  let sut: ChallengePrismaRepository;
  let addedAccount: AddAccountRepository.Result;

  beforeAll(async () => {
    await prisma.account.deleteMany({});
    await prisma.challenge.deleteMany({});
    await prisma.activeChallenge.deleteMany({});

    addedAccount = await new AccountPrismaRepository().add(mockAddAccountParams());
  });

  beforeEach(async () => {
    await prisma.challenge.deleteMany({});

    sut = new ChallengePrismaRepository();
  });

  describe('create', () => {
    it('should return challengeId if challenge created successfully', async () => {
      const mockParams = mockCreateChallengeParams();
      const result = await sut.create(mockParams);

      expect(result).toEqual({
        challengeId: expect.any(String),
      });
    });
  });

  describe('getTotalCount', () => {
    it('should return total challenges count', async () => {
      const mockParams = mockCreateChallengeParams();
      await sut.create(mockParams);

      const result = await sut.getTotalCount();

      expect(result).toEqual({
        total: 1,
      });
    });
  });

  describe('getByIndex', () => {
    it('should return challenge if exists', async () => {
      const mockParams = mockCreateChallengeParams();
      const createdFirstChallenge = await sut.create(mockParams);

      const mockOtherParams = mockCreateChallengeParams();
      mockOtherParams.periodicity = 'weekly';
      const createdSecondChallenge = await sut.create(mockOtherParams);

      const firstResult = await sut.getByIndex({
        challengeIndex: 1,
      });

      const secondResult = await sut.getByIndex({
        challengeIndex: 0,
      });

      expect(firstResult).toEqual({
        id: createdSecondChallenge.challengeId,
        description: mockOtherParams.description,
        type: mockOtherParams.type,
        goal: mockOtherParams.goal,
        periodicity: mockOtherParams.periodicity,
        reward: mockOtherParams.reward,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(secondResult).toEqual({
        id: createdFirstChallenge.challengeId,
        description: mockParams.description,
        type: mockParams.type,
        goal: mockParams.goal,
        periodicity: mockParams.periodicity,
        reward: mockParams.reward,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('setAccountChallenges', () => {
    it('should set account challenges', async () => {
      const mockParams = mockCreateChallengeParams();
      const createdFirstChallenge = await sut.create(mockParams);

      const mockOtherParams = mockCreateChallengeParams();
      mockOtherParams.periodicity = 'weekly';
      const createdSecondChallenge = await sut.create(mockOtherParams);

      const mockAccountParams = {
        accountId: addedAccount.id,
        challenges: [
          {
            id: createdFirstChallenge.challengeId,
          },
          {
            id: createdSecondChallenge.challengeId,
          },
        ],
      };

      await sut.setAccountChallenges(mockAccountParams);

      const accountChallenges = await prisma.activeChallenge.findMany({
        where: {
          accountId: mockAccountParams.accountId,
        },
      });

      expect(accountChallenges).toHaveLength(2);
    });
  });
});
