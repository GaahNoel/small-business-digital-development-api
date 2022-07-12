import { CreateOrderRepository } from '@/data/protocols/db/order/create-order.repository';
import { CreateOrder } from '@/domain/usecases/order';

export class DbCreateOrder implements CreateOrder {
  constructor(private readonly createOrderRepository: CreateOrderRepository) {}

  async create(order: CreateOrder.Params): Promise<CreateOrder.Result> {
    const result = await this.createOrderRepository.create(order);

    return result;
  }
}
