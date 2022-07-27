import { UpdateActiveChallenge } from '@/domain/usecases/challenge/update-active-challenge';
import { BuyOrSellAnyStrategy } from '@/presentation/strategies';

describe('BuyOrSellAnyStrategy', () => {
  let sut: BuyOrSellAnyStrategy;
  let updateActiveChallenge: UpdateActiveChallenge;

  const mockedProgress = 1;

  const makeRequest = (progress: number = 1) => ({
    id: 'any-id',
    challenge: {
      id: 'any_challenge_id',
      description: 'any_description',
      type: 'buyAny' as 'buyAny',
      goal: 5,
      periodicity: 'daily' as 'daily',
      reward: 100,
      createdAt: new Date('2020-12-12'),
      updatedAt: new Date('2020-12-12'),
    },
    accountId: 'any-id',
    progress,
    status: 'PENDING' as 'PENDING',
    createdAt: new Date('2020-12-12'),
    updatedAt: new Date('2020-12-12'),
  });

  beforeAll(() => {
    updateActiveChallenge = {
      updateActiveChallenge: jest.fn(async () => Promise.resolve({
        activeChallengeId: 'any_challenge_id',
        progress: mockedProgress + 1,
        status: 'PENDING',
      })),
    };
  });

  beforeEach(() => {
    sut = new BuyOrSellAnyStrategy(updateActiveChallenge);
  });

  it('should call updateActiveChallenge with correct params if should change status to COMPLETED', async () => {
    await sut.handle(makeRequest(4));

    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({
      activeChallengeId: 'any-id',
      progress: 5,
      status: 'COMPLETED',
    });
  });
  it('should call updateActiveChallenge with correct params if should not change status', async () => {
    await sut.handle(makeRequest());

    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({
      activeChallengeId: 'any-id',
      progress: mockedProgress + 1,
      status: 'PENDING',
    });
  });
  it('should return status if called successfully', async () => {
    const result = await sut.handle(makeRequest());

    expect(result).toEqual({
      status: 'PENDING',
    });
  });

  it('should throw error if updateActiveChallenge throws', async () => {
    (updateActiveChallenge.updateActiveChallenge as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));

    const promise = sut.handle(makeRequest());

    await expect(promise).rejects.toThrow();
  });
});
