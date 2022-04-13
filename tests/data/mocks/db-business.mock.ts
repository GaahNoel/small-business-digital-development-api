import { mockBusinessModel } from '@/tests/domain/mocks/business.mock';
import { AddBusinessRepository } from '../protocols/db/business/add-business.repository';

export const mockAddBusinessRepository = (): AddBusinessRepository => {
  class AddBusinessRepositoryStub implements AddBusinessRepository {
    async add(data: AddBusinessRepository.Params): Promise<AddBusinessRepository.Result> {
      const mockedBusinessModel = mockBusinessModel();
      return Promise.resolve({
        id: mockedBusinessModel.id,
      });
    }
  }

  return new AddBusinessRepositoryStub();
};
