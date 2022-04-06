import { mockAddCategoryParams } from '@/tests/domain/mocks/category.mock';
import { mockAddCategoryRepository } from '@/tests/data/mocks/db-category.mock';
import { AddCategoryController } from '@/presentation/controller/category/addCategory.controller';
import { AddCategoryRepository } from '@/data/protocols/db/category';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';

type SutTypes = {
  sut: AddCategoryController,
  addCategoryRepositoryStub: AddCategoryRepository,
};

const makeSut = (): SutTypes => {
  const addCategoryRepositoryStub = mockAddCategoryRepository();

  const sut = new AddCategoryController(addCategoryRepositoryStub);

  return {
    sut,
    addCategoryRepositoryStub,
  };
};

describe('AddCategory Controller', () => {
  it('should call AddCategory with correct values', async () => {
    const { sut, addCategoryRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addCategoryRepositoryStub, 'add');
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
    const { sut, addCategoryRepositoryStub } = makeSut();
    jest.spyOn(addCategoryRepositoryStub, 'add').mockReturnValue(Promise.reject(new Error()));

    const request = mockAddCategoryParams();

    const response = await sut.handle(request);
    expect(response).toEqual(internalServerError(new Error()));
  });
});
