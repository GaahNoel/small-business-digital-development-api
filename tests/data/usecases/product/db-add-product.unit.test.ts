import { AddProductRepository } from '@/data';
import { mockAddProductParams } from '@/tests/domain/mocks/product.mock';
import { DbAddProduct } from '@/data/usecases/product';
import { mockAddProductRepository } from '../../mocks/db-product.mock';

type SutTypes = {
  sut: DbAddProduct,
  addProductRepositoryStub: AddProductRepository,
};

const makeSut = (): SutTypes => {
  const addProductRepositoryStub = mockAddProductRepository();
  const sut = new DbAddProduct(addProductRepositoryStub);

  return {
    sut,
    addProductRepositoryStub,
  };
};

describe('AddProduct UseCase', () => {
  it('should call AddProductRepository with the correct params', async () => {
    const { sut, addProductRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addProductRepositoryStub, 'add');
    const productParams = mockAddProductParams();

    await sut.add(productParams);

    expect(addSpy).toHaveBeenCalledWith(productParams);
  });

  it('should return product id if called with correct params', async () => {
    const { sut } = makeSut();
    const productParams = mockAddProductParams();

    const result = await sut.add(productParams);

    expect(result).toEqual({
      id: 'any_id',
    });
  });
});
