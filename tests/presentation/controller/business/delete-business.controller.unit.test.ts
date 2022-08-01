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
    (deleteBusiness.delete as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error()));

    const result = sut.handle({
      businessId: 'any-business-id',
    });

    await expect(result).rejects.toThrow(new Error());
  });

  it('should throw MissingParamsError if id is not provided', async () => {
    const result = sut.handle({ businessId: '' });

    await expect(result).rejects.toThrow(new MissingParamsError({
      params: ['businessId'],
    }));
  });
});
