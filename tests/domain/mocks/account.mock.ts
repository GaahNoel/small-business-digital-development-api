import { AccountModel } from '@/domain/models/account';
import { AddAccountParams } from '@/domain/usecases/account/add-account';
import { EditAccountParams } from '../usecases/account';

export const mockAddAccountParams = (email = 'any_email'): AddAccountParams => ({
  name: 'any_name',
  email,
  password: 'any_password',
  provider: 'credentials',
});

export const mockEditAccountParams = (id: string): EditAccountParams => ({
  id,
  name: 'any_name',
  email: 'any_email',
  password: 'any_password',
});

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  verified: true,
  ...mockAddAccountParams(),
});
