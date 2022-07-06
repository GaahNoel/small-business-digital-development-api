import { DeleteProductRepository } from '@/data/protocols/db/product/';
import { DbDeleteProduct } from '@/data/usecases/product/db-delete-product';

describe('DbDeleteProduct', () => {
  let sut: DbDeleteProduct;
  let deleteProductRepository: DeleteProductRepository;
  const mockProduct = {
    id: 'any-id',
  };

  beforeAll(() => {
    deleteProductRepository = {
      delete: jest.fn(async () => Promise.resolve({ id: 'any-id' })),
    };
  });

  beforeEach(() => {
    sut = new DbDeleteProduct(deleteProductRepository);
  });

  it('should call delete product with correct params', async () => {
    await sut.delete({
      productId: mockProduct.id,
    });

    expect(deleteProductRepository.delete).toHaveBeenCalledWith({
      productId: mockProduct.id,
    });
  });

  it('should return deleted true if product removed successfully', async () => {
    const result = await sut.delete({
      productId: mockProduct.id,
    });

    expect(result).toEqual({
      id: mockProduct.id,
      delete: true,
    });
  });

  it('should throw if DeleteProductRepository throws', async () => {
    deleteProductRepository.delete = jest.fn(() => Promise.reject(new Error()));

    const promise = sut.delete({
      productId: mockProduct.id,
    });

    await expect(promise).rejects.toThrow();
  });
});
