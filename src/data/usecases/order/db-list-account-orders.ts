import { ListAccountOrdersRepository } from '@/data/protocols/db/order/list-account-orders.repository';
import { ListAccountOrders } from '@/domain/usecases/order';

export class DbListAccountOrders implements ListAccountOrders {
  constructor(private readonly listAccountOrdersRepository: ListAccountOrdersRepository) {}

  async listAccountOrders(params: ListAccountOrders.Params): Promise<ListAccountOrders.Result> {
    return this.listAccountOrdersRepository.listAccountOrders({
      accountId: params.accountId,
      type: params.type,
    });
  }
}
