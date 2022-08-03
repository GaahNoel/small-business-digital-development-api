import { ListProductFromBusiness } from '@/domain/usecases/product';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { mockAddProduct } from '../../mocks/product.mock';
import { ListProductFromBusinessController } from '@/presentation/controller/product';
import { mockCategoryModel } from '@/tests/domain/mocks/category.mock';

describe('ListProductFromBusinessController', () => {
  let sut: ListProductFromBusinessController;
  let listProductFromBusiness: ListProductFromBusiness;
  const mockedCategory = mockCategoryModel();

  beforeEach(() => {
    listProductFromBusiness = {
      list: jest.fn().mockReturnValue([{
        ...mockAddProduct(),
        category: {
          id: mockedCategory.id,
          name: mockedCategory.name,
        },
      }]),
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

    expect(response).toEqual(success([{
      ...mockAddProduct(),
      category: {
        id: mockedCategory.id,
        name: mockedCategory.name,
      },
    }]));
  });

  it('should throw error listProductFromBusiness throws', async () => {
    listProductFromBusiness.list = jest.fn().mockReturnValueOnce(Promise.reject(new Error()));
    const response = sut.handle({
      businessId: 'any-business-id',
    });

    await expect(response).rejects.toThrow(new Error());
  });
});
