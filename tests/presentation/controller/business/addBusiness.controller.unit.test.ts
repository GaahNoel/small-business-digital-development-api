import { AddBusiness, AddBusinessParams } from '@/domain/usecases/business';
import { mockAddBusiness } from '../../mocks/business.mock';
import { AddBusinessController } from '@/presentation/controller/business/addBusiness.controller';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';

type SutTypes = {
  sut: AddBusinessController,
  addBusinessStub: AddBusiness,
};

const makeSut = (): SutTypes => {
  const addBusinessStub = mockAddBusiness();
  const sut = new AddBusinessController(addBusinessStub);
  return {
    sut,
    addBusinessStub,
  };
};

const fakeRequest : AddBusinessParams = {
  name: 'any_name',
  description: 'any_email',
  accountId: 'any_account_id',
  imageUrl: 'any_image_url',
};

describe('AddBusiness Controller', () => {
  it('should call AddBusiness with correct values', async () => {
    const { sut, addBusinessStub } = makeSut();
    const addSpy = jest.spyOn(addBusinessStub, 'add');
    await sut.handle(fakeRequest);
    expect(addSpy).toHaveBeenCalledWith(fakeRequest);
  });

  it('should return success if called with right params', async () => {
    const { sut } = makeSut();
    const response = await sut.handle(fakeRequest);
    expect(response).toEqual(success({ id: 'any_id' }));
  });

  it('should return internal server error if AddBusiness throws', async () => {
    const { sut, addBusinessStub } = makeSut();
    jest.spyOn(addBusinessStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse).toEqual(internalServerError(new Error()));
  });
});
