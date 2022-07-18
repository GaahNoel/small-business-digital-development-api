import { GetOrderByIdRepository, UpdateOrderByIdRepository } from '@/data/protocols/db/order';
import { ChangeOrderStatus } from '@/domain/usecases/order/change-order-status';
import { NotFound } from '@/presentation/errors';

export class DbChangeOrderStatus implements ChangeOrderStatus {
  constructor(private readonly getOrderById: GetOrderByIdRepository, private readonly updateOrderById: UpdateOrderByIdRepository) {}

  public async changeOrderStatus(params: ChangeOrderStatus.Params): Promise<ChangeOrderStatus.Result> {
    const order = await this.getOrderById.getOrderById({
      orderId: params.orderId,
    });

    if (!order) {
      throw new NotFound({
        entity: 'Order',
      });
    }

    const updatedOrder = await this.updateOrderById.updateOrderById({
      orderId: params.orderId,
      status: params.status,
    });

    return {
      orderId: updatedOrder.orderId,
      status: updatedOrder.status,
    };
  }
}
