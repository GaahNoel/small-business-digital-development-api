import { GetProductByIdRepository } from '@/data/protocols';
import { ChangeBonusStatusRepository, GetAccountBonusByIdRepository } from '@/data/protocols/db/bonus';
import { ListBusinessByIdRepository } from '@/data/protocols/db/business/list-business-by-id.repository';
import { CreateOrderRepository } from '@/data/protocols/db/order/create-order.repository';
import { CreateOrder } from '@/domain/usecases/order';
import { InvalidParamsError } from '@/presentation/errors/invalid-params.error';

export class DbCreateOrder implements CreateOrder {
  constructor(
    private readonly createOrderRepository: CreateOrderRepository,
    private readonly getBusinessByIdRepository: ListBusinessByIdRepository,
    private readonly getProductByIdRepository: GetProductByIdRepository,
    private readonly getAccountBonusByIdRepository: GetAccountBonusByIdRepository,
    private readonly changeBonusStatusRepository: ChangeBonusStatusRepository,
  ) {}

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
    let totalOrderValue = order.total;

    if (order.couponId) {
      const accountBonus = await this.getAccountBonusByIdRepository.getAccountBonusById({
        bonusId: order.couponId,
      });

      const expireDate = new Date(accountBonus.createdAt);
      expireDate.setDate(expireDate.getDate() + accountBonus.bonus.duration);

      if (expireDate < new Date()) {
        await this.changeBonusStatusRepository.changeBonusStatus({
          accountBonusId: order.couponId,
          status: 'EXPIRED',
        });

        throw new InvalidParamsError({
          params: ['couponId'],
        });
      }

      if (accountBonus.status !== 'ACTIVE' || accountBonus.bonus.type !== 'coupon') {
        throw new InvalidParamsError({
          params: ['couponId'],
        });
      }

      totalOrderValue -= (totalOrderValue * (accountBonus.value / 100));

      await this.changeBonusStatusRepository.changeBonusStatus({
        accountBonusId: order.couponId,
        status: 'USED',
      });
    }

    const result = await this.createOrderRepository.create({
      businessId: order.businessId,
      buyerId: order.buyerId,
      description: order.description,
      paymentMethod: order.paymentMethod,
      change: order.change,
      items: order.items,
      latitude: order.latitude,
      longitude: order.longitude,
      total: totalOrderValue,
      accountBonusId: order.couponId,
      sellerId: business.accountId,
    });

    return result;
  }
}
