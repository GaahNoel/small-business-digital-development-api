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
    const { status, entity } = this.selectStatusAndEntity(order, params);

    const updatedOrder = await this.updateOrderById.updateOrderById({
      orderId: params.orderId,
      status,
      statusType: 'order',
    });

    await this.updateOrderById.updateOrderById({
      orderId: params.orderId,
      status: params.status,
      statusType: entity,
    });

    return {
      orderId: updatedOrder.orderId,
      status: updatedOrder.status,
      buyerStatus: updatedOrder.buyerStatus,
      sellerStatus: updatedOrder.sellerStatus,
    };
  }

  private selectStatusAndEntity(order: GetOrderByIdRepository.Result, { status, accountId }: ChangeOrderStatus.Params): { status: 'PENDING' | 'COMPLETED' | 'CANCELED', entity: 'seller' | 'buyer' } {
    const entitySelected = accountId === order.buyerId ? 'buyer' : 'seller';

    const orderStatusSelected = entitySelected === 'buyer' ? order.sellerStatus : order.buyerStatus;

    if (orderStatusSelected === 'PENDING') {
      return {
        status: 'PENDING',
        entity: entitySelected,
      };
    }

    if (orderStatusSelected !== status) {
      return {
        status: 'CANCELED',
        entity: entitySelected,
      };
    }

    return {
      status: 'COMPLETED',
      entity: entitySelected,
    };
  }
}
