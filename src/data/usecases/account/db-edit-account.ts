import { Hasher } from '@/data/protocols/cryptography';
import { EditAccountRepository } from '@/data/protocols/db/account/edit-account.repository';
import { EditAccount, EditAccountParams } from '@/domain/usecases/account/edit-account';

export class DbEditAccount implements EditAccount {
  constructor(private readonly editAccountRepository: EditAccountRepository, private readonly hasher: Hasher) {}

  async edit(editAccountParams: EditAccountParams): Promise<EditAccount.Result> {
    const { password, ...params } = editAccountParams;

    if (password) {
      const hashedPassword = await this.hasher.hash(password);
      Object.assign(params, { password: hashedPassword });
    }

    const result = await this.editAccountRepository.edit(params);
    return {
      id: result.id,
      success: true,
    };
  }
}
