import { CreateChallenge } from '@/domain/usecases/challenge';
import { CreateChallengeController } from '@/presentation/controller/challenge';
import { success } from '@/presentation/helpers/http.helpers';
import { mockCreateChallengeParams } from '@/tests/domain/mocks/challenge.mock';

describe('CreateChallengeController', () => {
  let sut: CreateChallengeController;
  let createChallenge: CreateChallenge;

  beforeAll(() => {
    createChallenge = {
      create: jest.fn(async () => Promise.resolve({ challengeId: 'any_challenge_id' })),
    };
  });

  beforeEach(() => {
    sut = new CreateChallengeController(createChallenge);
  });

  it('should call createChallenge with correct params', async () => {
    const mockParams = mockCreateChallengeParams();
    await sut.handle(mockParams);

    expect(createChallenge.create).toHaveBeenCalledWith({
      description: mockParams.description,
      type: mockParams.type,
      goal: mockParams.goal,
      periodicity: mockParams.periodicity,
      reward: mockParams.reward,
    });
  });

  it('should return challengeId on success', async () => {
    const result = await sut.handle(mockCreateChallengeParams());
    expect(result).toEqual(success({ challengeId: 'any_challenge_id' }));
  });

  it('should return internalServerError if createChallenge throws', async () => {
    createChallenge.create = jest.fn(async () => Promise.reject(new Error()));
    const result = sut.handle(mockCreateChallengeParams());
    await expect(result).rejects.toThrow(new Error());
  });
});
