import { BusinessModel } from '@/domain/models/business';
import { AddBusiness } from '@/domain/usecases/business/add-business';

export const mockAddBusinessParams = (accountId = 'any_account_id'): AddBusiness.Params => ({
  name: 'any_name',
  accountId,
  description: 'any_email',
  imageUrl: 'any_password',
});

export const mockBusinessModel = (): BusinessModel => ({
  id: 'any_id',
  ...mockAddBusinessParams(),
});
