import { BusinessModel } from '@/domain/models/business';
import { AddBusiness } from '@/domain/usecases/business/add-business';
import { ListBusinessFromUser } from '../usecases/business';

export const mockAddBusinessParams = (accountId = 'any_account_id'): AddBusiness.Params => ({
  name: 'any_name',
  accountId,
  description: 'any_description',
  imageUrl: 'any_imageUrl',
});

export const mockBusinessModel = (): BusinessModel => ({
  id: 'any_id',
  ...mockAddBusinessParams(),
});

export const mockListBusinessModel = (): ListBusinessFromUser.Result => ([{
  id: 'any_id',
  name: 'any_name',
  description: 'any_description',
  imageUrl: 'any_imageUrl',
}]);
