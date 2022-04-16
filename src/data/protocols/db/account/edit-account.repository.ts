import { EditAccount } from '@/domain/usecases/account';

export interface EditAccountRepository {
  edit(data: EditAccountRepository.Params): Promise<EditAccountRepository.Result>;
}

export namespace EditAccountRepository {
  export type Params = EditAccount.Params;
  export type Result = EditAccount.Result;
}
