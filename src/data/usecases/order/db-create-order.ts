import { GetProductByIdRepository } from '@/data/protocols';
import { ListBusinessByIdRepository } from '@/data/protocols/db/business/list-business-by-id.repository';
import { CreateOrderRepository } from '@/data/protocols/db/order/create-order.repository';
import { CreateOrder } from '@/domain/usecases/order';
import { InvalidParamsError } from '@/presentation/errors/invalid-params.error';

export class DbCreateOrder implements CreateOrder {
  constructor(private readonly createOrderRepository: CreateOrderRepository, private readonly getBusinessByIdRepository: ListBusinessByIdRepository, private readonly getProductByIdRepository: GetProductByIdRepository) {}

  async create(order: CreateOrder.Params): Promise<CreateOrder.Result> {
    const business = await this.getBusinessByIdRepository.listById({
      businessId: order.businessId,
    });

    const totalProductSum = await order.items.reduce(async (acc, product) => {
      const productFound = await this.getProductByIdRepository.get({
        productId: product.productId,
      });

      return await acc + productFound.salePrice * product.quantity;
    }, Promise.resolve(0));

    if (totalProductSum !== order.total) {
      throw new InvalidParamsError({
        params: ['total'],
      });
    }

    const result = await this.createOrderRepository.create({
      ...order,
      sellerId: business.accountId,
    });

    return result;
  }
}
