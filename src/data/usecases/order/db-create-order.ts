import { ListBusinessByIdRepository } from '@/data/protocols/db/business/list-business-by-id.repository';
import { CreateOrderRepository } from '@/data/protocols/db/order/create-order.repository';
import { CreateOrder } from '@/domain/usecases/order';

export class DbCreateOrder implements CreateOrder {
  constructor(private readonly createOrderRepository: CreateOrderRepository, private readonly getBusinessByIdRepository: ListBusinessByIdRepository) {}

  async create(order: CreateOrder.Params): Promise<CreateOrder.Result> {
    const business = await this.getBusinessByIdRepository.listById({
      businessId: order.businessId,
    });

    const result = await this.createOrderRepository.create({
      ...order,
      sellerId: business.accountId,
    });

    return result;
  }
}
