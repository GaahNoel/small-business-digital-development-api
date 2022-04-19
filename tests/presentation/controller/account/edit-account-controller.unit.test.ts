import { EditAccount } from '@/domain/usecases/account';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { EditAccountController } from '@/presentation/controller/account/edit-account.controller';

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

  it('should return 500 on EditAccount throws', async () => {
    editAccount.edit = jest.fn(async () => Promise.reject(new Error()));
    const httpResponse = await sut.handle(fakeRequest);

    expect(httpResponse).toEqual(internalServerError(new Error()));
  });

  it('should return badRequest if no params was provided', async () => {
    const httpResponse = await sut.handle({
      id: 'any-id',
    });

    expect(httpResponse).toEqual(badRequest(new Error()));
  });

  it('should return badRequest if id was provided', async () => {
    const httpResponse = await sut.handle({
      id: '',
    });

    expect(httpResponse).toEqual(badRequest(new Error()));
  });
});
