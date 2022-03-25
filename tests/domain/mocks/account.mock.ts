import { AccountModel } from '../models/account/account';
import { AddAccountParams } from '../usecases/account/add-account';

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email',
  password: 'any_password',
});

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  ...mockAddAccountParams(),
});
