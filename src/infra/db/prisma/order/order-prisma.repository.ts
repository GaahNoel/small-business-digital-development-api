import { prisma } from '@/infra/db/helpers';
import { CreateOrderRepository } from '@/data/protocols/db/order/create-order.repository';
import { OrderItem } from '@/domain/models/order';
import { GetOrderByIdRepository, UpdateOrderByIdRepository } from '@/data/protocols/db/order';
import { ListAccountOrders } from '@/domain/usecases/order';
import { ListAccountOrdersRepository } from '@/data/protocols/db/order/list-account-orders.repository';

export class OrderPrismaRepository implements CreateOrderRepository, GetOrderByIdRepository, UpdateOrderByIdRepository, ListAccountOrdersRepository {
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

  async getOrderById(params: GetOrderByIdRepository.Params): Promise<GetOrderByIdRepository.Result> {
    return prisma.order.findFirst({
      where: {
        id: params.orderId,
      },
      select: {
        id: true,
        status: true,
        total: true,
        businessId: true,
        buyerId: true,
        sellerId: true,
        items: {
          select: {
            id: true,
            quantity: true,
            productId: true,
          },
        },
      },
    });
  }

  async updateOrderById(params: UpdateOrderByIdRepository.Params): Promise<UpdateOrderByIdRepository.Result> {
    const { orderId, status } = params;

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    });

    return {
      orderId,
      status: updatedOrder.status,
      total: updatedOrder.total,
    };
  }

  async listAccountOrders(params: { accountId: string; type: 'buy' | 'sell'; }): Promise<ListAccountOrdersRepository.Result> {
    const where = params.type === 'buy' ? { buyerId: params.accountId } : { sellerId: params.accountId };

    const select = {
      id: true,
      Business: {
        select: {
          id: true,
          name: true,
        },
      },
      sellerId: true,
      status: true,
      total: true,
      createdAt: true,
      updatedAt: true,
      buyerId: true,
      items: {
        select: {
          id: true,
          quantity: true,
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              salePrice: true,
              listPrice: true,
              imageUrl: true,
            },
          },
        },
      },
    };

    const orders = await prisma.order.findMany({
      where,
      select,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders;
  }
}
