import { mockAddCategoryParams } from '@/tests/domain/mocks/category.mock';
import { mockAddCategoryRepository } from '@/tests/data/mocks/db-category.mock';
import { AddCategoryController } from '@/presentation/controller/category/addCategory.controller';
import { AddCategoryRepository } from '@/data/protocols/db/category';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { mockAddCategory } from '../../mocks/category.mock';
import { AddCategory } from '@/domain/usecases/category/add-category';

type SutTypes = {
  sut: AddCategoryController,
  addCategoryStub: AddCategory,
};

const makeSut = (): SutTypes => {
  const addCategoryStub = mockAddCategory();

  const sut = new AddCategoryController(addCategoryStub);

  return {
    sut,
    addCategoryStub,
  };
};

describe('AddCategory Controller', () => {
  it('should call AddCategory with correct values', async () => {
    const { sut, addCategoryStub } = makeSut();
    const addSpy = jest.spyOn(addCategoryStub, 'add');
    const request = mockAddCategoryParams();

    await sut.handle(request);
    expect(addSpy).toHaveBeenCalledWith(request);
  });

  it('should return success if called with right params', async () => {
    const { sut } = makeSut();
    const request = mockAddCategoryParams();

    const response = await sut.handle(request);
    expect(response).toEqual(success({ id: expect.anything() }));
  });

  it('should return internal server error if add category throws', async () => {
    const { sut, addCategoryStub } = makeSut();
    jest.spyOn(addCategoryStub, 'add').mockReturnValue(Promise.reject(new Error()));

    const request = mockAddCategoryParams();

    const response = await sut.handle(request);
    expect(response).toEqual(internalServerError(new Error()));
  });
});
