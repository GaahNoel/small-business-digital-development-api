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
    latitude?: number;
    longitude?: number;
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
      latitude: data.latitude,
      longitude: data.longitude,
    });

    await this.emailVerificationSender.send({
      message: `Seu pedido foi criada com sucesso! Id do Pedido: ${order.orderId}`,
      subject: 'Pedido Criado',
      toEmail: buyerAccount.email,
    });

    await this.emailVerificationSender.send({
      message: `Você recebeu um novo pedido! Id do Pedido: ${order.orderId}`,
      subject: 'Pedido Recebido',
      toEmail: sellerAccount.email,
    });

    return success({
      orderId: order.orderId,
    });
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
