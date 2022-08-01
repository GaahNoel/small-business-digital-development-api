import { mockVerifyAccount } from '../../mocks/account.mock';
import { VerifyAccountController } from '@/presentation/controller/account';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';

const makeSut = () => {
  const verifyAccount = mockVerifyAccount();
  const sut = new VerifyAccountController(verifyAccount);

  return {
    sut,
    verifyAccount,
  };
};
describe('VerifyAccountController ', () => {
  it('should call verify account repository with correct values', async () => {
    const { sut, verifyAccount } = makeSut();
    const request = {
      id: 'any_id',
    };
    const verifySpy = jest.spyOn(verifyAccount, 'verify');
    await sut.handle(request);

    expect(verifySpy).toHaveBeenCalledWith(request.id);
    expect(verifySpy).toHaveBeenCalledTimes(1);
  });

  it('should throw error if verify account throws', async () => {
    const { sut, verifyAccount } = makeSut();
    jest.spyOn(verifyAccount, 'verify').mockImplementationOnce(() => {
      throw new Error();
    });

    const response = sut.handle({
      id: 'any_id',
    });

    await expect(response).rejects.toThrow(new Error());
  });

  it('should return success if correct id was provided', async () => {
    const { sut } = makeSut();
    const request = {
      id: 'correct_id',
    };
    const response = await sut.handle(request);

    expect(response).toEqual(success({ verified: true }));
  });
});
