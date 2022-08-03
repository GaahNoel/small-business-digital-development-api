import { GetAccountChallengeRepository } from '@/data/protocols/db/challenge/get-account-challenge.repository';
import { DbGetAccountChallenges } from '@/data/usecases/challenge';
import { NotFound } from '@/presentation/errors';

describe('DbGetAccountChallenges', () => {
  let sut: DbGetAccountChallenges;
  let getAccountChallengeRepository: GetAccountChallengeRepository;

  const params = {
    accountId: 'any_account_id',
  };

  beforeAll(() => {
    getAccountChallengeRepository = {
      getAccountChallenges: jest.fn(async () => Promise.resolve({
        challenges: [{
          id: 'any_id',
          challenge: {
            id: 'any_challenge_id',
            description: 'any_description',
            type: 'buyAny' as 'buyAny',
            goal: 5,
            periodicity: 'daily' as 'daily',
            reward: 100,
            createdAt: new Date('2022-03-10'),
            updatedAt: new Date('2022-03-10'),
          },
          accountId: 'any_account_id',
          progress: 1,
          status: 'PENDING' as 'PENDING',
          createdAt: new Date('2022-03-10'),
          updatedAt: new Date('2022-03-10'),
        }],
      })),
    };
  });

  beforeEach(() => {
    sut = new DbGetAccountChallenges(getAccountChallengeRepository);
  });

  it('should call GetAccountChallengeRepository with correct values', async () => {
    await sut.getAccountChallenges(params);

    expect(getAccountChallengeRepository.getAccountChallenges).toHaveBeenCalledWith(params);
  });

  it('should throw not found error if challenges not found', async () => {
    (getAccountChallengeRepository.getAccountChallenges as jest.Mock).mockImplementationOnce(async () => Promise.resolve({
      challenges: [],
    }));

    const promise = sut.getAccountChallenges(params);

    await expect(promise).rejects.toThrow(new NotFound({
      entity: 'challenge',
    }));
  });

  it('should return account challenges if found', async () => {
    const accountChallenges = await sut.getAccountChallenges(params);

    expect(accountChallenges).toEqual({
      challenges: [{
        id: 'any_id',
        challenge: {
          id: 'any_challenge_id',
          description: 'any_description',
          type: 'buyAny' as 'buyAny',
          goal: 5,
          periodicity: 'daily' as 'daily',
          reward: 100,
          createdAt: new Date('2022-03-10'),
          updatedAt: new Date('2022-03-10'),
        },
        accountId: 'any_account_id',
        progress: 1,
        status: 'PENDING' as 'PENDING',
        createdAt: new Date('2022-03-10'),
        updatedAt: new Date('2022-03-10'),
      }],
    });
  });
});
