import { AddCategoryRepository } from '@/data/protocols/db/category/addCategory.repository';
import { mockAddCategoryParams } from '@/tests/domain/mocks/category.mock';
import { mockAddCategoryRepository } from '../../mocks/db-category.mock';
import { DbAddCategory } from '@/data/usecases/category';

type SutTypes = {
  sut: DbAddCategory,
  addCategoryRepositoryStub: AddCategoryRepository,
};

const makeSut = () : SutTypes => {
  const addCategoryRepositoryStub = mockAddCategoryRepository();
  const sut = new DbAddCategory(addCategoryRepositoryStub);

  return {
    sut,
    addCategoryRepositoryStub,
  };
};

describe('DbAddCategory UseCase', () => {
  it('should call add category repository with correct params', async () => {
    const { sut, addCategoryRepositoryStub } = makeSut();

    const addCategoryRepositorySpy = jest.spyOn(addCategoryRepositoryStub, 'add');

    await sut.add(mockAddCategoryParams());
    expect(addCategoryRepositorySpy).toHaveBeenCalledWith(mockAddCategoryParams());
  });
});
