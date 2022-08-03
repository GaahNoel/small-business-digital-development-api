import { EditProduct } from '@/domain/usecases/product';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { EditProductController } from '@/presentation/controller/product/edit-product.controller';

describe('EditProductController', () => {
  let editProductController: EditProductController;
  let editProduct: EditProduct;

  const editProductParams = {
    productId: 'any_id',
    name: 'any_name',
    description: 'any_description',
    listPrice: 1,
    salePrice: 2,
    imageUrl: 'any_image_url',
  };

  beforeAll(() => {
    editProduct = {
      edit: jest.fn(async () => ({
        productId: 'any_id',
      })),
    };
  });
  beforeEach(() => {
    editProductController = new EditProductController(editProduct);
  });

  it('should call edit product with correct params', async () => {
    await editProductController.handle(editProductParams);

    expect(editProduct.edit).toHaveBeenCalledWith(editProductParams);
  });

  it('should return success with productId if edit product returns productId', async () => {
    const result = await editProductController.handle(editProductParams);

    expect(result).toEqual(success({ productId: 'any_id' }));
  });
  it('should throw error if edit product throws error', async () => {
    (editProduct.edit as jest.Mock).mockImplementation(async () => Promise.reject(new Error()));

    const result = editProductController.handle(editProductParams);

    await expect(result).rejects.toThrow(new Error());
  });

  it('should throw MissingParamsError if productId was not provided', async () => {
    const result = editProductController.handle({
      ...editProductParams,
      productId: undefined,
    });

    await expect(result).rejects.toThrow(new MissingParamsError({
      params: ['productId'],
    }));
  });
});
