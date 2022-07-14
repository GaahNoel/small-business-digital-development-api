import { GetOrderByIdRepository } from '@/data/protocols/db/order';
import { GetOrderById } from '@/domain/usecases/order';
import { NotFound } from '@/presentation/errors';

export class DbGetOrderById implements GetOrderById {
  constructor(private readonly getOrderByIdRepository: GetOrderByIdRepository) {}

  async getOrderById(params: GetOrderById.Params): Promise<GetOrderById.Result> {
    const result = await this.getOrderByIdRepository.getOrderById({
      orderId: params.orderId,
    });

    if (!result) {
      throw new NotFound({
        entity: 'Order',
      });
    }

    return {
      id: result.id,
      status: result.status,
      total: result.total,
      businessId: result.businessId,
      buyerId: result.buyerId,
      items: result.items,
    };
  }
}
