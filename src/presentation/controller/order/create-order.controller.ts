import { EmailVerificationSender } from '@/data/protocols/email/email-verification-sender';
import { OrderItem } from '@/domain/models/order';
import { GetAccountById } from '@/domain/usecases/account';
import { ListBusinessById } from '@/domain/usecases/business';
import { CreateOrder } from '@/domain/usecases/order';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import { InvalidParamsError } from '@/presentation/errors/invalid-params.error';
import {
  badRequest, internalServerError, notFound, success,
} from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace CreateOrderController {
  export type Params = {
    businessId: string;
    buyerId: string;
    total: number;
    items: OrderItem[];
    description?: string;
    paymentMethod: 'CreditCard' | 'Cash'
    change?: number;
  };
  export type Result = HttpResponse;

}

export class CreateOrderController implements BaseController {
  constructor(
    private readonly createOrder: CreateOrder,
    private readonly getAccountById: GetAccountById,
    private readonly getBusinessById: ListBusinessById,
    private readonly emailVerificationSender: EmailVerificationSender,
  ) {}

  async handle(data: CreateOrderController.Params): Promise<CreateOrderController.Result> {
    try {
      this.validate(data);

      const buyerAccount = await this.getAccountById.getById({
        accountId: data.buyerId,
      });

      const business = await this.getBusinessById.list({
        businessId: data.businessId,
      });

      const sellerAccount = await this.getAccountById.getById({
        accountId: business.accountId,
      });

      const order = await this.createOrder.create({
        businessId: data.businessId,
        buyerId: data.buyerId,
        total: data.total,
        items: data.items,
        description: data.description,
        paymentMethod: data.paymentMethod,
        change: data.change,
      });

      await this.emailVerificationSender.send({
        message: `Your order has been created. OrderId: ${order.orderId}`,
        subject: 'Order created',
        toEmail: buyerAccount.email,
      });

      await this.emailVerificationSender.send({
        message: `You received an order. OrderId: ${order.orderId}`,
        subject: 'Order created',
        toEmail: sellerAccount.email,
      });

      return success({
        orderId: order.orderId,
      });
    } catch (error) {
      if (error instanceof InvalidParamsError) {
        return badRequest(error);
      }

      if (error instanceof NotFound) {
        return notFound(error);
      }

      if (error instanceof MissingParamsError || error instanceof InvalidParamsError) {
        return badRequest(error);
      }

      return internalServerError(error);
    }
  }

  private validate(data: CreateOrderController.Params): void {
    const {
      businessId, buyerId, total, items,
    } = data;

    const missingParams = [];
    if (!businessId) {
      missingParams.push('businessId');
    }
    if (!buyerId) {
      missingParams.push('buyerId');
    }
    if (!total) {
      missingParams.push('total');
    }
    if (!items) {
      missingParams.push('items');
    }

    if (missingParams.length > 0) {
      throw new MissingParamsError({
        params: missingParams,
      });
    }

    if (data.paymentMethod !== 'CreditCard' && data.paymentMethod !== 'Cash') {
      throw new InvalidParamsError({
        params: ['paymentMethod'],
      });
    }
  }
}
