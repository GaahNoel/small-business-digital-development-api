import { DeleteProduct } from '@/domain/usecases/product';
import { success } from '@/presentation/helpers/http.helpers';
import { DeleteProductController } from '@/presentation/controller/product/delete-product.controller';
import { MissingParamsError } from '@/presentation/errors';

describe('DeleteProductController', () => {
  let deleteProductController: DeleteProductController;
  let deleteProduct: DeleteProduct;

  const mockProduct = {
    id: 'any-id',
  };

  beforeAll(() => {
    deleteProduct = {
      delete: jest.fn(() => Promise.resolve({ id: 'any-id', delete: true })),
    };
  });

  beforeEach(() => {
    deleteProductController = new DeleteProductController(deleteProduct);
  });

  it('should return success if delete product executed successfully', async () => {
    const result = await deleteProductController.handle({
      productId: mockProduct.id,
    });

    expect(result).toEqual(success({
      id: mockProduct.id,
      delete: true,
    }));
  });

  it('should throw error if delete product throws', async () => {
    deleteProduct.delete = jest.fn(() => Promise.reject(new Error()));

    const response = deleteProductController.handle({
      productId: mockProduct.id,
    });

    await expect(response).rejects.toThrow(new Error());
  });

  it('should throw MissingParamsError if id not provided', async () => {
    const response = deleteProductController.handle({
      productId: '',
    });

    await expect(response).rejects.toThrow(new MissingParamsError({
      params: ['productId'],
    }));
  });
});
