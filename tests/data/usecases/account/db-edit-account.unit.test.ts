import { DbEditAccount } from '@/data/usecases/account/db-edit-account';

const fakeRequest = {
  id: 'any-id',
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

  const hasher = {
    hash: jest.fn(async () => 'hashed_password'),
  };

  beforeEach(() => {
    sut = new DbEditAccount(editAccountRepository, hasher);
  });

  it('should call editAccountRepository with correct values', async () => {
    await sut.edit(fakeRequest);

    expect(editAccountRepository.edit).toHaveBeenCalledWith({
      ...fakeRequest,
      password: 'hashed_password',
    });
  });

  it('should return success true and id of user if successfully edit with all params', async () => {
    const response = await sut.edit(fakeRequest);

    expect(response).toEqual({
      id: 'any_id',
      success: true,
    });
  });

  it('should return success true and id of user if successfully edit with only password', async () => {
    const { password, id, ...request } = fakeRequest;
    const response = await sut.edit({
      id,
      password,
    });

    expect(response).toEqual({
      id: 'any_id',
      success: true,
    });
  });

  it('should return success true and id of user if successfully edit with only email', async () => {
    const { email, id, ...request } = fakeRequest;
    const response = await sut.edit({
      id,
      email,
    });

    expect(response).toEqual({
      id: 'any_id',
      success: true,
    });
  });

  it('should return success true and id of user if successfully edit with only name', async () => {
    const { name, id, ...request } = fakeRequest;
    const response = await sut.edit({
      id,
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

  it('should hash the password if it was provided', async () => {
    await sut.edit(fakeRequest);

    expect(hasher.hash).toHaveBeenCalledWith('any-password');
    expect(editAccountRepository.edit).toBeCalledWith({
      ...fakeRequest,
      password: 'hashed_password',
    });
  });
});
