import { BusinessModel } from '@/domain/models/business';
import { AddBusiness } from '@/domain/usecases/business/add-business';
import { ListBusinessFromAccount } from '../usecases/business';

export const mockAddBusinessParams = (accountId = 'any_account_id'): AddBusiness.Params => ({
  name: 'any_name',
  accountId,
  description: 'any_description',
  imageUrl: 'any_imageUrl',
  city: 'any_city',
  country: 'any_country',
  latitude: 'any_latitude',
  longitude: 'any_longitude',
  state: 'any_state',
  street: 'any_street',
  zip: 'any_zip',
});

export const mockBusinessModel = (): BusinessModel => ({
  id: 'any_id',
  ...mockAddBusinessParams(),
});

export const mockListBusinessModel = (): ListBusinessFromAccount.Result => ([{
  id: 'any_id',
  name: 'any_name',
  description: 'any_description',
  imageUrl: 'any_imageUrl',
}]);
