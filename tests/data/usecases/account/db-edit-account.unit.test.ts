import { DbEditAccount } from '@/data/usecases/account/db-edit-account';

const fakeRequest = {
  password: 'any-password',
  email: 'any-email',
  name: 'any-name',
};

describe('DbEditAccount UseCase', () => {
  let sut: DbEditAccount;
  const editAccountRepository = {
    edit: jest.fn(async () => (Promise.resolve({
      id: 'any_id',
      success: true,
    }))),
  };

  beforeEach(() => {
    sut = new DbEditAccount(editAccountRepository);
  });

  it('should call editAccountRepository with correct values', async () => {
    await sut.edit(fakeRequest);

    expect(editAccountRepository.edit).toHaveBeenCalledWith(fakeRequest);
  });

  it('should return success true and id of user if successfully edit with all params', async () => {
    const response = await sut.edit(fakeRequest);

    expect(response).toEqual({
      id: 'any_id',
      success: true,
    });
  });

  it('should return success true and id of user if successfully edit with only password', async () => {
    const { password, ...request } = fakeRequest;
    const response = await sut.edit({
      password,
    });

    expect(response).toEqual({
      id: 'any_id',
      success: true,
    });
  });

  it('should return success true and id of user if successfully edit with only email', async () => {
    const { email, ...request } = fakeRequest;
    const response = await sut.edit({
      email,
    });

    expect(response).toEqual({
      id: 'any_id',
      success: true,
    });
  });

  it('should return success true and id of user if successfully edit with only name', async () => {
    const { name, ...request } = fakeRequest;
    const response = await sut.edit({
      name,
    });

    expect(response).toEqual({
      id: 'any_id',
      success: true,
    });
  });

  it('should throw error if editAccountRepository throws', async () => {
    jest.spyOn(editAccountRepository, 'edit').mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.edit(fakeRequest);

    await expect(promise).rejects.toThrow();
  });
});
