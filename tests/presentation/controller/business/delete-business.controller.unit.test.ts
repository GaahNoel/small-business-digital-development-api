import { DeleteBusiness } from '@/domain/usecases/business';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { DeleteBusinessController } from '@/presentation/controller/business';
import { MissingParamsError } from '@/presentation/errors';

describe('DeleteBusinessController', () => {
  let sut: DeleteBusinessController;
  let deleteBusiness: DeleteBusiness;

  beforeAll(() => {
    deleteBusiness = {
      delete: jest.fn(() => Promise.resolve({
        delete: true,
        id: 'any-id',
      })),
    };
  });

  beforeEach(() => {
    sut = new DeleteBusinessController(deleteBusiness);
  });

  it('should return success if deleted successfully', async () => {
    const result = await sut.handle({
      businessId: 'any-business-id',
    });

    expect(result).toEqual(success({
      delete: true,
      id: 'any-id',
    }));
  });

  it('should return internal server error if DeleteBusiness throws', async () => {
    deleteBusiness.delete = jest.fn(() => Promise.reject(new Error()));

    const result = await sut.handle({
      businessId: 'any-business-id',
    });

    expect(result).toEqual(internalServerError(new Error()));
  });

  it('should return bad request if id is not provided', async () => {
    const result = await sut.handle({ businessId: '' });

    expect(result).toEqual(badRequest(new MissingParamsError({
      params: ['businessId'],
    })));
  });
});
