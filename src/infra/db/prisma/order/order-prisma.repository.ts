import { prisma } from '@/infra/db/helpers';
import { CreateOrderRepository } from '@/data/protocols/db/order/create-order.repository';
import { OrderItem } from '@/domain/models/order';

export class OrderPrismaRepository implements CreateOrderRepository {
  async create(order: CreateOrderRepository.Params): Promise<CreateOrderRepository.Result> {
    const result = await prisma.order.create({
      data: {
        ...order,
        items: {
          create: order.items.map((orderItem: OrderItem) => ({
            ...orderItem,
          })),
        },
      },
    });

    return {
      orderId: result.id,
    };
  }
}
