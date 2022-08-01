import { EditBusiness } from '@/domain/usecases/business';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { EditBusinessController } from '@/presentation/controller/business';

describe('EditBusinessController', () => {
  const editBusinessParams = {
    businessId: 'any_id',
    name: 'any_name',
    imageUrl: 'any_image_url',
    accountId: 'any_account_id',
    description: 'any_description',
    latitude: 'any_latitude',
    longitude: 'any_longitude',
    street: 'any_street',
    city: 'any_city',
    state: 'any_state',
    zip: 'any_zip',
    country: 'any_country',
    maxPermittedCouponPercentage: 5,
  };

  let editBusinessController: EditBusinessController;
  let editBusiness: EditBusiness;

  beforeAll(() => {
    editBusiness = {
      edit: jest.fn(async () => Promise.resolve({ id: 'any_id' })),
    };
  });

  beforeEach(() => {
    editBusinessController = new EditBusinessController(editBusiness);
  });

  it('should call editBusiness with correct params', async () => {
    await editBusinessController.handle(editBusinessParams);

    expect(editBusiness.edit).toHaveBeenCalledWith(editBusinessParams);
  });

  it('should return success business id if editBusiness returns business id', async () => {
    const result = await editBusinessController.handle(editBusinessParams);

    expect(result).toEqual(success({ id: 'any_id' }));
  });

  it('should throw MissingParamsError if business id was not provided', async () => {
    const result = editBusinessController.handle({ ...editBusinessParams, businessId: undefined });

    await expect(result).rejects.toThrow(new MissingParamsError({
      params: ['businessId'],
    }));
  });

  it('should throw error if editBusiness throws', async () => {
    (editBusiness.edit as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));

    const response = editBusinessController.handle(editBusinessParams);

    await expect(response).rejects.toThrow(new Error());
  });
});
