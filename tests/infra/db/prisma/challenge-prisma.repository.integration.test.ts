import { mockCreateChallengeParams } from '@/tests/domain/mocks/challenge.mock';
import { ChallengePrismaRepository } from '@/infra/db/prisma/challenge';
import { prisma } from '@/infra/db/helpers';

describe('ChallengePrismaRepository', () => {
  let sut: ChallengePrismaRepository;

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
});
