import { UpdateActiveChallenge } from '@/domain/usecases/challenge/update-active-challenge';
import { DbUpdateActiveChallenge } from '@/data/usecases/challenge';

describe('DbUpdateActiveChallenge', () => {
  let sut: DbUpdateActiveChallenge;
  let updateActiveChallenge: UpdateActiveChallenge;

  beforeAll(() => {
    updateActiveChallenge = {
      updateActiveChallenge: jest.fn(async () => Promise.resolve({
        status: 'PENDING',
      })),
    };
  });

  beforeEach(() => {
    sut = new DbUpdateActiveChallenge(updateActiveChallenge);
  });

  it('should call updateActiveChallenge wiht correct params', async () => {
    const activeChallengeId = 'any_challenge_id';
    const progress = 1;
    const status = 'PENDING';

    const result = await sut.updateActiveChallenge({ activeChallengeId, progress, status });

    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({ activeChallengeId, progress, status });
    expect(result.status).toBe('PENDING');
  });

  it('should return new status when challenge is updated', async () => {
    (updateActiveChallenge.updateActiveChallenge as jest.Mock).mockResolvedValueOnce({ status: 'COMPLETED' });
    const activeChallengeId = 'any_challenge_id';
    const progress = 1;
    const status = 'COMPLETED';

    const result = await sut.updateActiveChallenge({ activeChallengeId, progress, status });

    expect(updateActiveChallenge.updateActiveChallenge).toHaveBeenCalledWith({ activeChallengeId, progress, status });
    expect(result.status).toBe('COMPLETED');
  });

  it('should throw error if updateActiveChallenge throws', async () => {
    (updateActiveChallenge.updateActiveChallenge as jest.Mock).mockRejectedValueOnce(new Error());
    const activeChallengeId = 'any_challenge_id';
    const progress = 1;
    const status = 'COMPLETED';

    const promise = sut.updateActiveChallenge({ activeChallengeId, progress, status });

    await expect(promise).rejects.toThrow();
  });
});
