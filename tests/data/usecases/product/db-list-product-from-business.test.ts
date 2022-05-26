import { ListProductFromBusinessRepository } from '@/data/protocols/db/product/list-product-from-business.repository';
import { DbListProductFromBusiness } from '@/data/usecases/product';
import { mockCategoryModel } from '@/tests/domain/mocks/category.mock';
import { mockAddProductModel } from '@/tests/domain/mocks/product.mock';

describe('DbListProductFromBusiness', () => {
  let sut: DbListProductFromBusiness;
  let listProductFromBusinessRepository: ListProductFromBusinessRepository;
  const mockedCategory = mockCategoryModel();

  beforeEach(async () => {
    listProductFromBusinessRepository = {
      list: jest.fn().mockReturnValue([{
        ...mockAddProductModel(),
        category: {
          id: mockedCategory.id,
          name: mockedCategory.name,
        },
      }]),
    };

    sut = new DbListProductFromBusiness(listProductFromBusinessRepository);
  });
  it('should call ListProductFromBusinessRepository with correct params', async () => {
    await sut.list({
      businessId: 'any-business-id',
    });

    expect(listProductFromBusinessRepository.list).toHaveBeenCalledWith({
      businessId: 'any-business-id',
    });
  });

  it('should return products if called successfully', async () => {
    const response = await sut.list({
      businessId: 'any-business-id',
    });

    const mockedProduct = mockAddProductModel();
    expect(response).toEqual([{
      ...mockedProduct,
      category: {
        id: mockedCategory.id,
        name: mockedCategory.name,
      },
    }]);
  });

  it('should throw error if ListProductFromBusinessRepository throws', async () => {
    listProductFromBusinessRepository.list = jest.fn().mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.list({
      businessId: 'any-id',
    });

    await expect(promise).rejects.toThrowError();
  });
});
