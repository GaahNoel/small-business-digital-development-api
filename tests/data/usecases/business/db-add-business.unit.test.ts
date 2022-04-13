import { mockAddBusinessParams } from '@/tests/domain/mocks/business.mock';
import { mockAddBusinessRepository } from '../../mocks/db-business.mock';
import { DbAddBusiness } from '@/data/usecases/business/db-add-business';

const makeSut = () => {
  const addBusinessRepositoryStub = mockAddBusinessRepository();

  const sut = new DbAddBusiness(addBusinessRepositoryStub);
  return {
    sut,
    addBusinessRepositoryStub,
  };
};
describe('DbAddBusiness UseCase', () => {
  it('should call repository with the right params', async () => {
    const { sut, addBusinessRepositoryStub } = makeSut();
    const addBusinessRepositorySpy = jest.spyOn(addBusinessRepositoryStub, 'add');
    const business = mockAddBusinessParams();

    await sut.add(business);

    expect(addBusinessRepositorySpy).toHaveBeenCalledWith(business);
  });

  it('should return the business created id', async () => {
    const { sut } = makeSut();
    const business = mockAddBusinessParams();

    const response = await sut.add(business);

    expect(response.id).toBe('any_id');
  });
});
