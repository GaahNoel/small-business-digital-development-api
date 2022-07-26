import { GetAllAccountIds } from '@/domain/usecases/account/get-all-acount-ids';
import { NotFound } from '@/presentation/errors';
import { internalServerError, notFound, success } from '@/presentation/helpers/http.helpers';
import { GetAllAccountIdsController } from '@/presentation/controller/account';

describe('GetAllAccountIdsController', () => {
  let sut: GetAllAccountIdsController;
  let getAllAccountIds: GetAllAccountIds;

  beforeAll(() => {
    getAllAccountIds = {
      getAllAccountIds: jest.fn(async () => Promise.resolve({
        accountIds: ['any_account_id'],
      })),
    };
  });

  beforeEach(() => {
    sut = new GetAllAccountIdsController(getAllAccountIds);
  });

  it('should call getAllAccountIds 1 time', async () => {
    await sut.handle();
    expect(getAllAccountIds.getAllAccountIds).toHaveBeenCalledTimes(1);
  });

  it('should return not found if getAllAccountIds throws not found error', async () => {
    (getAllAccountIds.getAllAccountIds as jest.Mock).mockImplementationOnce(async () => Promise.reject(new NotFound({
      entity: 'Account',
    })));
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(notFound(new NotFound({
      entity: 'Account',
    })));
  });

  it('should return accountIds if executed successfully', async () => {
    const accountIds = await sut.handle();
    expect(accountIds).toEqual(success({ accountIds: ['any_account_id'] }));
  });

  it('should return internal server error if getAllAccountIds throws', async () => {
    (getAllAccountIds.getAllAccountIds as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(internalServerError(new Error()));
  });
});
