import { ListCategory } from '@/domain/usecases/category';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { mockCategoryModel } from '@/tests/domain/mocks/category.mock';
import { ListCategoryController } from '@/presentation/controller/category';

describe('ListCategoryController', () => {
  let sut: ListCategoryController;
  let listCategory: ListCategory;
  const mockedCategoryModel = mockCategoryModel();

  const mockedListCategoryReturn = [{
    id: mockedCategoryModel.id,
    name: mockedCategoryModel.name,
  },
  {
    id: mockedCategoryModel.id,
    name: mockedCategoryModel.name,
  },
  ];

  beforeAll(() => {
    listCategory = {
      list: jest.fn(async () => Promise.resolve(mockedListCategoryReturn)),
    };
  });

  beforeEach(() => {
    sut = new ListCategoryController(listCategory);
  });

  it('should call ListCategory with correct values', async () => {
    await sut.handle();

    expect(listCategory.list).toHaveBeenCalledTimes(1);
  });

  it('should return a list of categories on success', async () => {
    const result = await sut.handle();

    expect(result).toEqual(success(mockedListCategoryReturn));
  });

  it('should return internal server error if ListCategory throws', async () => {
    listCategory.list = jest.fn(async () => Promise.reject(new Error()));

    const result = await sut.handle();

    expect(result).toEqual(internalServerError(new Error()));
  });
});
