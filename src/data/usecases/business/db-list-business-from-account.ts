import { ListBusinessFromAccountRepository } from '@/data/protocols/db/business';
import { ListBusinessFromAccount } from '@/domain/usecases/business';

export class DbListBusinessFromAccount implements ListBusinessFromAccount {
  constructor(private readonly listBusinessFromAccountRepository : ListBusinessFromAccountRepository) {}

  list(ListBusinessParams: ListBusinessFromAccount.Params): Promise<ListBusinessFromAccount.Result> {
    return this.listBusinessFromAccountRepository.listFromAccount(ListBusinessParams);
  }
}
