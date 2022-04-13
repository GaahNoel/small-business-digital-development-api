import { ListProductFromBusiness } from '@/domain/usecases/product';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { mockAddProduct } from '../../mocks/product.mock';
import { ListProductFromBusinessController } from '@/presentation/controller/product';

describe('ListProductFromBusinessController', () => {
  let sut: ListProductFromBusinessController;
  let listProductFromBusiness: ListProductFromBusiness;
  beforeEach(() => {
    listProductFromBusiness = {
      list: jest.fn().mockReturnValue([mockAddProduct()]),
    };
    sut = new ListProductFromBusinessController(listProductFromBusiness);
  });
  it('should call ListProductFromBusiness with correct params', async () => {
    await sut.handle({
      businessId: 'any-business-id',
    });

    expect(listProductFromBusiness.list).toHaveBeenCalledWith({
      businessId: 'any-business-id',
    });
  });

  it('should return success if called successfully', async () => {
    const response = await sut.handle({
      businessId: 'any-business-id',
    });

    expect(response).toEqual(success([mockAddProduct()]));
  });

  it('should return internal server error listProductFromBusiness throws', async () => {
    listProductFromBusiness.list = jest.fn().mockReturnValueOnce(Promise.reject(new Error()));
    const response = await sut.handle({
      businessId: 'any-business-id',
    });

    expect(response).toEqual(internalServerError(new Error()));
  });
});
