import { DbEditAccount } from '@/data/usecases/account/db-edit-account';
import { AccountPrismaRepository } from '@/infra';
import { BcryptAdapter } from '@/infra/cryptography';
import { EditAccountController } from '@/presentation/controller/account';
import { ErrorHandlerDecorator } from '@/presentation/decorators';
import { BaseController } from '@/presentation/protocols';

export const makeEditAccountController = (): BaseController => {
  const salt = 12;
  const getUserByEmailRepository = new AccountPrismaRepository();
  const hashComparer = new BcryptAdapter(salt);

  const EditAccount = new DbEditAccount(getUserByEmailRepository, hashComparer);

  return new ErrorHandlerDecorator(new EditAccountController(EditAccount));
};
