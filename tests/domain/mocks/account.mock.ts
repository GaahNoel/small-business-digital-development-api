import { AccountModel } from '@/domain/models/account';
import { AddAccountParams } from '@/domain/usecases/account/add-account';
import { EditAccountParams } from '../usecases/account';

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email',
  password: 'any_password',
});

export const mockEditAccountParams = (id: string): EditAccountParams => ({
  id,
  name: 'any_name',
  email: 'any_email',
  password: 'any_password',
});

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  ...mockAddAccountParams(),
});
