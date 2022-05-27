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
  it('should return internal server error if edit product throws error', async () => {
    (editProduct.edit as jest.Mock).mockImplementation(async () => Promise.reject(new Error()));

    const result = await editProductController.handle(editProductParams);

    expect(result).toEqual(internalServerError(new Error()));
  });

  it('should return bad request if productId was not provided', async () => {
    const result = await editProductController.handle({
      ...editProductParams,
      productId: undefined,
    });

    expect(result).toEqual(badRequest(new MissingParamsError({
      params: ['productId'],
    })));
  });
});
