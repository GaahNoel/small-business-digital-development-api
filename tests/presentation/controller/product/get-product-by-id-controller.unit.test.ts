import { GetProductById } from '@/domain/usecases/product';
import { GetProductByIdController } from '@/presentation/controller/product';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import {
  badRequest, internalServerError, notFound, success,
} from '@/presentation/helpers/http.helpers';

describe('GetProductByIdController', () => {
  let sut: GetProductByIdController;
  let getProductById: GetProductById;

  beforeAll(() => {
    getProductById = {
      get: jest.fn(async () => Promise.resolve({
        id: 'any-id',
        name: 'any-name',
        type: 'product',
        description: 'any-description',
        listPrice: 1111111,
        salePrice: 1111111,
        imageUrl: 'any-image-url',
        businessId: 'any-business-id',
        category: {
          id: 'any-category-id',
          name: 'any-category-name',
        },
      })),
    };
  });

  beforeEach(() => {
    sut = new GetProductByIdController(getProductById);
  });

  it('should call getProductById with correct values', async () => {
    const productId = 'any-product-id';
    await sut.handle({
      productId,
    });
    expect(getProductById.get).toHaveBeenCalledWith({ productId });
  });

  it('should return a product on success', async () => {
    const productId = 'any-product-id';
    const response = await sut.handle({
      productId,
    });
    expect(response).toEqual(success({
      id: 'any-id',
      name: 'any-name',
      type: 'product',
      description: 'any-description',
      listPrice: 1111111,
      salePrice: 1111111,
      imageUrl: 'any-image-url',
      businessId: 'any-business-id',
      category: {
        id: 'any-category-id',
        name: 'any-category-name',
      },
    }));
  });

  it('should return bad request if validation fails', async () => {
    const response = await sut.handle({
      productId: undefined,
    });
    expect(response).toEqual(badRequest(new MissingParamsError({ params: ['productId'] })));
  });

  it('should return not found if GetProductById throws NotFound Error', async () => {
    (getProductById.get as jest.Mock).mockImplementation(async () => Promise.reject(new NotFound({
      entity: 'Product',
    })));
    const productId = 'any-product-id';
    const response = await sut.handle({
      productId,
    });
    expect(response).toEqual(notFound(new NotFound({
      entity: 'Product',
    })));
  });

  it('should return internalServerError if GetProductById throws unhandled error ', async () => {
    (getProductById.get as jest.Mock).mockImplementation(async () => Promise.reject(new Error()));
    const productId = 'any-product-id';
    const response = await sut.handle({
      productId,
    });
    expect(response).toEqual(internalServerError(new Error()));
  });
});
