import { GetAccountById } from '@/domain/usecases/account';
import { RenewAccountChallenges } from '@/domain/usecases/challenge';
import { RenewAccountChallengesController } from '@/presentation/controller/challenge';
import { NotFound } from '@/presentation/errors';
import { internalServerError, notFound, success } from '@/presentation/helpers/http.helpers';

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
      })),
    };
  });

  beforeEach(() => {
    sut = new RenewAccountChallengesController(renewAccountChallenges, getAccountById);
  });

  it('should call getAccountById with correct values', async () => {
    const accountId = 'any_account_id';
    await sut.handle({ accountId });
    expect(getAccountById.getById).toHaveBeenCalledWith({
      accountId,
    });
  });

  it('should call renewAccountChallenges with correct values', async () => {
    const accountId = 'any_account_id';
    await sut.handle({ accountId });
    expect(renewAccountChallenges.renew).toHaveBeenCalledWith({
      accountId,
    });
  });

  it('should return success if renew is execute successfully', async () => {
    const accountId = 'any_account_id';
    const response = await sut.handle({ accountId });
    expect(response).toEqual(success({
      challenges: [{
        id: 'any_id',
      }],
    }));
  });

  it('should return not found if account was nos found', async () => {
    (getAccountById.getById as jest.Mock).mockImplementationOnce(async () => Promise.resolve(null));
    const accountId = 'any_account_id';
    const response = await sut.handle({ accountId });
    expect(response).toEqual(notFound(new NotFound({
      entity: 'Account',
    })));
  });
  it('should return internal server error if any error occur', async () => {
    (renewAccountChallenges.renew as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));
    const accountId = 'any_account_id';
    const response = await sut.handle({ accountId });
    expect(response).toEqual(internalServerError(new Error()));
  });
});
