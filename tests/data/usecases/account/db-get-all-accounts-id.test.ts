import { GetAllAccountIdsRepository } from '@/data/protocols/db/challenge/get-all-account-ids.repository';
import { DbGetAllAccountIds } from '@/data/usecases/account';
import { NotFound } from '@/presentation/errors';

describe('DbGetAllAccountIds', () => {
  let sut: DbGetAllAccountIds;
  let getAllAccountIdsRepository: GetAllAccountIdsRepository;

  beforeAll(() => {
    getAllAccountIdsRepository = {
      getAllAccountIds: jest.fn(async () => Promise.resolve({
        accountIds: ['any_account_id'],
      })),
    };
  });

  beforeEach(() => {
    sut = new DbGetAllAccountIds(getAllAccountIdsRepository);
  });

  it('should call getAllAccountIdsRepository 1 time', async () => {
    await sut.getAllAccountIds();
    expect(getAllAccountIdsRepository.getAllAccountIds).toHaveBeenCalledTimes(1);
  });

  it('should throw not found error if accounts not found', async () => {
    (getAllAccountIdsRepository.getAllAccountIds as jest.Mock).mockImplementationOnce(async () => Promise.resolve({ accountIds: [] }));
    const promise = sut.getAllAccountIds();
    await expect(promise).rejects.toThrow(new NotFound({ entity: 'Account' }));
  });

  it('should return account ids if found', async () => {
    const accountIds = await sut.getAllAccountIds();
    expect(accountIds).toEqual({ accountIds: ['any_account_id'] });
  });
});
