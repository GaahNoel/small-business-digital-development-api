import { GetProductByIdRepository } from '@/data/protocols/db/product';
import { DbGetProductById } from '@/data/usecases/product';
import { NotFound } from '@/presentation/errors';

describe('DbGetProductById', () => {
  let sut: DbGetProductById;
  let getProductByIdRepository: GetProductByIdRepository;

  beforeAll(() => {
    getProductByIdRepository = {
      get: jest.fn(async () => Promise.resolve({
        name: 'any_name',
        type: 'product',
        description: 'any_description',
        listPrice: 1111111,
        salePrice: 1111111,
        imageUrl: 'any_image_url',
        businessId: 'any_business_id',
        category: {
          id: 'any_category_id',
          name: 'any_category_name',
        },
      })),
    };
  });

  beforeEach(() => {
    sut = new DbGetProductById(getProductByIdRepository);
  });

  it('should call getProductByIdRepository with correct values', async () => {
    const productId = 'any_product_id';
    await sut.get({ productId });
    expect(getProductByIdRepository.get).toHaveBeenCalledWith({ productId });
  });

  it('should return a product on success', async () => {
    const productId = 'any_product_id';
    const product = await sut.get({ productId });
    expect(product).toEqual({
      name: 'any_name',
      type: 'product',
      description: 'any_description',
      listPrice: 1111111,
      salePrice: 1111111,
      imageUrl: 'any_image_url',
      businessId: 'any_business_id',
      category: {
        id: 'any_category_id',
        name: 'any_category_name',
      },
    });
  });

  it('should throw error if getProductByIdRepository throws', () => {
    (getProductByIdRepository.get as jest.Mock).mockImplementation(async () => Promise.reject(new Error()));
  });
  it('should throw not found error if product not found', () => {
    (getProductByIdRepository.get as jest.Mock).mockImplementation(async () => Promise.resolve(null));
    const productId = 'any_product_id';
    const promise = sut.get({ productId });
    expect(promise).rejects.toThrow(new NotFound({
      entity: 'Product',
    }));
  });
});
