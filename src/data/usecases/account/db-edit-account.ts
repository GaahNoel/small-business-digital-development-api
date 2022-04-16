import { EditAccountRepository } from '@/data/protocols/db/account/edit-account.repository';
import { EditAccount, EditAccountParams } from '@/domain/usecases/account/edit-account';

export class DbEditAccount implements EditAccount {
  constructor(private readonly editAccountRepository: EditAccountRepository) {}

  async edit(editAccountParams: EditAccountParams): Promise<EditAccount.Result> {
    const result = await this.editAccountRepository.edit(editAccountParams);
    return result;
  }
}
