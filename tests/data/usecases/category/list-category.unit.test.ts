import { ListCategoryRepository } from '@/data/protocols/db/category/list-category.repository';
import { mockCategoryModel } from '@/tests/domain/mocks/category.mock';
import { ListCategoryUseCase } from '@/data/usecases/category/list-category';

describe('ListCategoryUseCase', () => {
  let listCategoryUseCase: ListCategoryUseCase;
  let listCategoryRepository: ListCategoryRepository;
  const mockedCategoryModel = mockCategoryModel();

  beforeAll(() => {
    listCategoryRepository = {
      list: jest.fn(async () => Promise.resolve([mockedCategoryModel, mockedCategoryModel])),
    };
  });

  beforeEach(() => {
    listCategoryUseCase = new ListCategoryUseCase(listCategoryRepository);
  });

  it('should call ListCategoryRepository with correct values', async () => {
    await listCategoryUseCase.list();

    expect(listCategoryRepository.list).toHaveBeenCalledTimes(1);
  });

  it('should return a list of categories', async () => {
    const result = await listCategoryUseCase.list();

    expect(result).toEqual([{
      id: mockedCategoryModel.id,
      name: mockedCategoryModel.name,
    }, {
      id: mockedCategoryModel.id,
      name: mockedCategoryModel.name,
    }]);
  });
});
