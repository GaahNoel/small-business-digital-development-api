import { EditProductRepository } from '@/data/protocols/db/product/edit-product.repository';
import { DbEditProduct } from '@/data/usecases/product/db-edit-product';

describe('DbEditProduct', () => {
  let dbEditProduct: DbEditProduct;
  let editProductRepository: EditProductRepository;

  const editProductParams = {
    productId: 'any_id',
    name: 'any_name',
    description: 'any_description',
    listPrice: 1,
    salePrice: 2,
    imageUrl: 'any_image_url',
  };

  beforeAll(() => {
    editProductRepository = {
      edit: jest.fn(async () => Promise.resolve({ productId: 'any_id' })),
    };
  });

  beforeEach(() => {
    dbEditProduct = new DbEditProduct(editProductRepository);
  });

  it('should call edit product repository with correct params', async () => {
    await dbEditProduct.edit(editProductParams);

    expect(editProductRepository.edit).toHaveBeenCalledWith(editProductParams);
  });

  it('should return productId if edit product repository returns productId', async () => {
    const result = await dbEditProduct.edit(editProductParams);

    expect(result).toEqual({ productId: 'any_id' });
  });

  it('should throw error if edit product repository throws error', async () => {
    editProductRepository.edit = jest.fn(async () => Promise.reject(new Error('any_error')));

    await expect(dbEditProduct.edit(editProductParams)).rejects.toThrow('any_error');
  });
});
