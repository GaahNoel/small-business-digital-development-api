import { CreateChallengeRepository } from '@/data/protocols/db/challenge/create-challenge.repository';
import { DbCreateChallenge } from '@/data/usecases/challenge';
import { mockCreateChallengeParams } from '@/tests/domain/mocks/challenge.mock';

describe('DbCreateChallenge', () => {
  let sut: DbCreateChallenge;
  let createChallengeRepository: CreateChallengeRepository;

  beforeAll(() => {
    createChallengeRepository = {
      create: jest.fn(async () => Promise.resolve({ challengeId: 'any_challenge_id' })),
    };
  });

  beforeEach(() => {
    sut = new DbCreateChallenge(createChallengeRepository);
  });

  it('should call createChallengeRepository with correct params', async () => {
    const mockParams = mockCreateChallengeParams();
    await sut.create(mockParams);

    expect(createChallengeRepository.create).toHaveBeenCalledWith({
      description: mockParams.description,
      type: mockParams.type,
      goal: mockParams.goal,
      periodicity: mockParams.periodicity,
      reward: mockParams.reward,
    });
  });

  it('should return a challengeId on success', async () => {
    const result = await sut.create(mockCreateChallengeParams());
    expect(result).toEqual({ challengeId: 'any_challenge_id' });
  });
});
