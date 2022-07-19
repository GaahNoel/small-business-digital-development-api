import { ListProductsByBusinessesRepository } from '@/data/protocols/db/product/list-products-by-businesses.repository';
import { DbListProductsByBusinesses } from '@/data/usecases/product';
import { NotFound } from '@/presentation/errors';

describe('DbListProductsByBusinesses', () => {
  let sut: DbListProductsByBusinesses;
  let listProductsByBusinessesRepository: ListProductsByBusinessesRepository;

  const mockedProduct = {
    id: 'any_product_id',
    name: 'any_product_name',
    type: 'product' as 'product' | 'service',
    description: 'any_product_description',
    listPrice: 1,
    salePrice: 2,
    imageUrl: 'any_product_image_url',
    business: {
      id: 'any_product_business_id',
      name: 'any_product_business_name',
      latitude: '-23.4727186',
      longitude: '-47.7642403',
    },
    category: {
      id: 'any_product_category_id',
      name: 'any_product_category_name',
    },
    createdAt: expect.any(Date),
  };

  const mockedService = {
    id: 'any_service_id',
    name: 'any_service_name',
    type: 'service' as 'product' | 'service',
    description: 'any_service_description',
    listPrice: 1,
    salePrice: 2,
    imageUrl: 'any_service_image_url',
    business: {
      id: 'any_service_business_id',
      name: 'any_service_business_name',
      latitude: '-23.4727186',
      longitude: '-47.7642403',
    },
    category: {
      id: 'any_service_category_id',
      name: 'any_service_category_name',
    },
    createdAt: expect.any(Date),
  };

  beforeAll(() => {
    listProductsByBusinessesRepository = {
      listProductsByBusinesses: jest.fn(async () => Promise.resolve([mockedProduct])),
    };
  });

  beforeEach(() => {
    sut = new DbListProductsByBusinesses(listProductsByBusinessesRepository);
  });

  it('should return a list of products type product', async () => {
    const result = await sut.listProductsByBusinesses({
      businessesIds: ['any_business_id'],
      type: 'product',
    });
    expect(result).toEqual([mockedProduct]);
  });

  it('should return a list of products type service', async () => {
    (listProductsByBusinessesRepository.listProductsByBusinesses as jest.Mock).mockResolvedValueOnce([mockedService]);
    const result = await sut.listProductsByBusinesses({
      businessesIds: ['any_business_id'],
      type: 'service',
    });
    expect(result).toEqual([mockedService]);
  });

  it('should return a list of products type product with distance', async () => {
    const result = await sut.listProductsByBusinesses({
      businessesIds: ['any_business_id'],
      type: 'product',
      location: {
        latitude: -23.6703196,
        longitude: -47.2068247,
        radius: 80,
      },
    });
    expect(result).toEqual([{
      ...mockedProduct,
      business: {
        ...mockedProduct.business,
        distance: 60.91,
      },
    }]);
  });

  it('should throw not found if no products was found on db', async () => {
    (listProductsByBusinessesRepository.listProductsByBusinesses as jest.Mock).mockResolvedValue([]);
    await expect(sut.listProductsByBusinesses({
      businessesIds: ['any_business_id'],
      type: 'product',
    })).rejects.toThrow(new NotFound({
      entity: 'Product',
    }));
  });
});
