import { EditAccount } from '@/domain/usecases/account';
import { success } from '@/presentation/helpers/http.helpers';
import { EditAccountController } from '@/presentation/controller/account/edit-account.controller';
import { MissingParamsError } from '@/presentation/errors';

const fakeRequest = {
  id: 'any-id',
  name: 'any-name',
  email: 'any-email',
  password: 'any-password',
};
describe('EditAccountController', () => {
  let sut : EditAccountController;
  let editAccount: EditAccount;

  beforeEach(() => {
    editAccount = {
      edit: jest.fn(async () => Promise.resolve({
        id: 'any-id',
        success: true,
      })),
    };
    sut = new EditAccountController(editAccount);
  });

  it('should call editAccount with correct values', async () => {
    await sut.handle(fakeRequest);

    expect(editAccount.edit).toHaveBeenCalledWith(fakeRequest);
  });

  it('should return 200 on success', async () => {
    const httpResponse = await sut.handle(fakeRequest);

    expect(httpResponse).toEqual(success({
      id: 'any-id',
      success: true,
    }));
  });

  it('should throws on EditAccount throws', async () => {
    editAccount.edit = jest.fn(async () => Promise.reject(new Error()));
    const httpResponse = sut.handle(fakeRequest);

    await expect(httpResponse).rejects.toThrow(new Error());
  });

  it('should throw MissingParamsError if no params was provided', async () => {
    const httpResponse = sut.handle({
      id: 'any-id',
    });

    await expect(httpResponse).rejects.toThrow(new MissingParamsError({
      params: ['name', 'password', 'email'],
    }));
  });

  it('should throw MissingParamsError if id was not provided', async () => {
    const httpResponse = sut.handle({
      id: '',
    });

    await expect(httpResponse).rejects.toThrow(new MissingParamsError({
      params: ['id', 'name', 'password', 'email'],
    }));
  });
});
