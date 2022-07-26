import { GetAccountChallenges } from '@/domain/usecases/challenge';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import { badRequest, internalServerError, notFound } from '@/presentation/helpers/http.helpers';
import { GetAccountChallengesController } from '@/presentation/controller/challenge';

describe('GetAccountChallengesController', () => {
  let sut: GetAccountChallengesController;
  let getAccountChallenges: GetAccountChallenges;

  beforeAll(() => {
    getAccountChallenges = {
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
    sut = new GetAccountChallengesController(getAccountChallenges);
  });

  it('should call GetAccountChallenges with correct values', async () => {
    await sut.handle({
      accountId: 'any_account_id',
    });

    expect(getAccountChallenges.getAccountChallenges).toHaveBeenCalledWith({
      accountId: 'any_account_id',
    });
  });

  it('should return not found if challenges not found', async () => {
    getAccountChallenges.getAccountChallenges = jest.fn(async () => Promise.reject(new NotFound({
      entity: 'challenge',
    })));

    const result = await sut.handle({
      accountId: 'any_account_id',
    });

    expect(result).toEqual(notFound(new NotFound({
      entity: 'challenge',
    })));
  });

  it('should return bad request if account id not provided', async () => {
    const result = await sut.handle({
      accountId: undefined,
    });

    expect(result).toEqual(badRequest(new MissingParamsError({
      params: ['accountId'],
    })));
  });

  it('should return internalServerError when received not handled error', async () => {
    (getAccountChallenges.getAccountChallenges as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));

    const result = await sut.handle({
      accountId: 'any_account_id',
    });

    expect(result).toEqual(internalServerError(new Error()));
  });
});
