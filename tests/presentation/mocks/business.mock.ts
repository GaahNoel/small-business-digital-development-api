import { AddBusiness } from '@/domain/usecases/business';
import { mockBusinessModel } from '@/tests/domain/mocks/business.mock';

export const mockAddBusiness = (): AddBusiness => {
  class AddBusinessStub implements AddBusiness {
    async add(data: AddBusiness.Params): Promise<AddBusiness.Result> {
      return Promise.resolve(mockBusinessModel());
    }
  }
  return new AddBusinessStub();
};
