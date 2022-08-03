import { AddBusiness, AddBusinessParams } from '@/domain/usecases/business';
import { mockAddBusiness } from '../../mocks/business.mock';
import { AddBusinessController } from '@/presentation/controller/business';
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
  city: 'any_city',
  country: 'any_country',
  latitude: 'any_latitude',
  longitude: 'any_longitude',
  state: 'any_state',
  street: 'any_street',
  zip: 'any_zip',
  maxPermittedCouponPercentage: 10,
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

  it('should throw error if AddBusiness throws', async () => {
    const { sut, addBusinessStub } = makeSut();
    jest.spyOn(addBusinessStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = sut.handle(fakeRequest);
    await expect(httpResponse).rejects.toThrow(new Error());
  });
});
