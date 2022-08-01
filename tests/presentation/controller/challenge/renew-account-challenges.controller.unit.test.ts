import { GetAccountById } from '@/domain/usecases/account';
import { RenewAccountChallenges } from '@/domain/usecases/challenge';
import { RenewAccountChallengesController } from '@/presentation/controller/challenge';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import { InvalidParamsError } from '@/presentation/errors/invalid-params.error';
import {
  success,
} from '@/presentation/helpers/http.helpers';

describe('RenewAccountChallengesController', () => {
  let sut: RenewAccountChallengesController;
  let renewAccountChallenges: RenewAccountChallenges;
  let getAccountById: GetAccountById;

  beforeAll(() => {
    renewAccountChallenges = {
      renew: jest.fn(async () => Promise.resolve({
        challenges: [{
          id: 'any_id',
        }],
      })),
    };

    getAccountById = {
      getById: jest.fn(async () => Promise.resolve({
        email: 'any_email',
        name: 'any_name',
        id: 'any_id',
        verified: true,
        provider: 'credentials',
        balance: 10,
      })),
    };
  });

  beforeEach(() => {
    sut = new RenewAccountChallengesController(renewAccountChallenges, getAccountById);
  });

  it('should call getAccountById with correct values', async () => {
    const accountId = 'any_account_id';
    await sut.handle({ accountId, periodicity: 'daily' });
    expect(getAccountById.getById).toHaveBeenCalledWith({
      accountId,
    });
  });

  it('should call renewAccountChallenges with correct values', async () => {
    const accountId = 'any_account_id';
    await sut.handle({ accountId, periodicity: 'daily' });
    expect(renewAccountChallenges.renew).toHaveBeenCalledWith({
      accountId,
      periodicity: 'daily',
    });
  });

  it('should return success if renew is execute successfully', async () => {
    const accountId = 'any_account_id';
    const response = await sut.handle({ accountId, periodicity: 'daily' });
    expect(response).toEqual(success({
      challenges: [{
        id: 'any_id',
      }],
    }));
  });

  it('should return not found if account was nos found', async () => {
    (getAccountById.getById as jest.Mock).mockImplementationOnce(async () => Promise.resolve(null));
    const accountId = 'any_account_id';
    const response = sut.handle({ accountId, periodicity: 'daily' });
    await expect(response).rejects.toThrow(new NotFound({
      entity: 'Account',
    }));
  });
  it('should return internal server error if any error occur', async () => {
    (renewAccountChallenges.renew as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));
    const accountId = 'any_account_id';
    const response = sut.handle({ accountId, periodicity: 'daily' });
    await expect(response).rejects.toThrow(new Error());
  });

  it.each([
    {
      params: {
        accountId: '',
        periodicity: 'daily' as 'daily',
      },
      missing: ['accountId'],
    },
    {
      params: {
        accountId: 'any-id',
        periodicity: '' as 'daily',
      },
      missing: ['periodicity'],
    },

  ])('should throw MissingParamsError', async (params) => {
    const { missing } = params;
    const result = sut.handle(params.params);

    await expect(result).rejects.toThrow(new MissingParamsError({ params: missing }));
  });

  it('should throw InvalidParamsError if periodicity is invalid', async () => {
    const result = sut.handle({
      accountId: 'any_id',
      periodicity: 'invalid' as 'daily',
    });

    await expect(result).rejects.toThrow(new InvalidParamsError({ params: ['periodicity'] }));
  });
});
