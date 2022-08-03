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
    await prisma.activeChallenge.deleteMany({});
    await prisma.challenge.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.business.deleteMany({});
    await prisma.account.deleteMany({});

    addedAccount = await new AccountPrismaRepository().add(mockAddAccountParams());
  });

  afterAll(async () => {
    await prisma.activeChallenge.deleteMany({});
    await prisma.challenge.deleteMany({});
    await prisma.account.deleteMany({});
  });

  beforeEach(async () => {
    await prisma.activeChallenge.deleteMany({});
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

      const result = await sut.getTotalCount({});

      expect(result).toEqual({
        total: 1,
      });
    });

    it('should return total daily challenges count', async () => {
      const mockParams = mockCreateChallengeParams();
      await sut.create(mockParams);

      const result = await sut.getTotalCount({
        periodicity: 'daily',
      });

      expect(result).toEqual({
        total: 1,
      });
    });
  });

  describe('getByIndex', () => {
    it('should return challenge if exists', async () => {
      const mockFirstDailyChallengeParams = mockCreateChallengeParams();
      await sut.create(mockFirstDailyChallengeParams);

      const mockSecondDailyChallengeParams = mockCreateChallengeParams();
      const createdSecondDailyChallenge = await sut.create(mockSecondDailyChallengeParams);

      const mockFirstWeeklyChallengeParams = mockCreateChallengeParams('weekly');
      await sut.create(mockFirstWeeklyChallengeParams);

      const mockSecondWeeklyChallengeParams = mockCreateChallengeParams('weekly');
      const createdSecondWeeklyChallenge = await sut.create(mockSecondWeeklyChallengeParams);

      const firstResult = await sut.getByIndex({
        challengeIndex: 1,
        periodicity: 'daily',
      });

      const secondResult = await sut.getByIndex({
        challengeIndex: 1,
        periodicity: 'weekly',
      });

      expect(firstResult).toEqual({
        id: createdSecondDailyChallenge.challengeId,
        description: mockSecondDailyChallengeParams.description,
        type: mockSecondDailyChallengeParams.type,
        goal: mockSecondDailyChallengeParams.goal,
        periodicity: mockSecondDailyChallengeParams.periodicity,
        reward: mockSecondDailyChallengeParams.reward,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(secondResult).toEqual({
        id: createdSecondWeeklyChallenge.challengeId,
        description: mockSecondWeeklyChallengeParams.description,
        type: mockSecondWeeklyChallengeParams.type,
        goal: mockSecondWeeklyChallengeParams.goal,
        periodicity: mockSecondWeeklyChallengeParams.periodicity,
        reward: mockSecondWeeklyChallengeParams.reward,
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
        periodicity: 'daily' as 'daily',
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

  describe('getAccountChallenges', () => {
    it('should return account challenges', async () => {
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
        periodicity: 'daily' as 'daily',
      };

      await sut.setAccountChallenges(mockAccountParams);

      const accountChallenges = await sut.getAccountChallenges({
        accountId: addedAccount.id,
      });

      expect(accountChallenges.challenges).toHaveLength(2);
    });
  });

  describe('updateActiveChallenge', () => {
    it('should update active challenge', async () => {
      const mockParams = mockCreateChallengeParams();
      const createdFirstChallenge = await sut.create(mockParams);

      const mockAccountParams = {
        accountId: addedAccount.id,
        challenges: [
          {
            id: createdFirstChallenge.challengeId,
          },
        ],
        periodicity: 'daily' as 'daily',
      };

      await sut.setAccountChallenges(mockAccountParams);

      const { challenges: accountChallenges } = await sut.getAccountChallenges({
        accountId: addedAccount.id,
      });

      const response = await sut.updateActiveChallenge({
        activeChallengeId: accountChallenges[0].id,
        progress: 5,
        status: 'COMPLETED',
      });

      expect(response).toEqual({
        status: 'COMPLETED',
      });
    });
  });
});
