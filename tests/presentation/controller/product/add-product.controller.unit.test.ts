import { AddProduct } from '@/domain/usecases/product/add-product';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { mockAddProductParams } from '@/tests/domain/mocks/product.mock';
import { mockAddProduct } from '../../mocks/product.mock';
import { AddProductController } from '@/presentation/controller/product/add-product.controller';

type SutTypes = {
  sut: AddProductController,
  addProductStub: AddProduct,
};

const makeSut = (): SutTypes => {
  const addProductStub = mockAddProduct();

  const sut = new AddProductController(addProductStub);

  return {
    sut,
    addProductStub,
  };
};

describe('AddProductController', () => {
  it('should call AddProduct with correct values', async () => {
    const { sut, addProductStub } = makeSut();
    const addSpy = jest.spyOn(addProductStub, 'add');
    const request = mockAddProductParams();

    await sut.handle(request);
    expect(addSpy).toHaveBeenCalledWith(request);
  });

  it('should return success if called with right params', async () => {
    const { sut } = makeSut();
    const request = mockAddProductParams();

    const response = await sut.handle(request);
    expect(response).toEqual(success({ id: expect.anything() }));
  });

  it('should return internal server error if add category throws', async () => {
    const { sut, addProductStub } = makeSut();
    jest.spyOn(addProductStub, 'add').mockReturnValue(Promise.reject(new Error()));

    const request = mockAddProductParams();

    const response = await sut.handle(request);
    expect(response).toEqual(internalServerError(new Error()));
  });
});
