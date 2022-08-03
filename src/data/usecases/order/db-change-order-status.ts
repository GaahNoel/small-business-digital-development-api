import { GetAccountByIdRepository } from '@/data/protocols';
import { ChangeBonusStatusRepository } from '@/data/protocols/db/bonus';
import { GetOrderByIdRepository, UpdateOrderByIdRepository } from '@/data/protocols/db/order';
import { EmailVerificationSender } from '@/data/protocols/email/email-verification-sender';
import { ChangeOrderStatus } from '@/domain/usecases/order/change-order-status';
import { NotFound } from '@/presentation/errors';

enum TranslateOrderStatus {
  PENDING = 'PENDENTE',
  COMPLETED = 'CONCLUÍDO',
  CANCELED = 'CANCELADO',
}

export class DbChangeOrderStatus implements ChangeOrderStatus {
  constructor(
    private readonly getOrderById: GetOrderByIdRepository,
    private readonly updateOrderById: UpdateOrderByIdRepository,
    private readonly getAccountById: GetAccountByIdRepository,
    private readonly emailSender: EmailVerificationSender,
    private readonly changeBonusStatusRepository: ChangeBonusStatusRepository,
  ) {}

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

    const { email: sellerEmail } = await this.getAccountById.getById({
      accountId: order.sellerId,
    });

    const { email: buyerEmail } = await this.getAccountById.getById({
      accountId: order.buyerId,
    });

    await this.emailSender.send({
      toEmail: buyerEmail,
      subject: 'Status do pedido alterado',
      message: `
        Olá, os status do seu pedido - ${order.id} foi alterado para: ${TranslateOrderStatus[status]},
        qualquer dúvida entre em contato com o vendedor por meio do email: ${sellerEmail}
      `,
    });

    await this.emailSender.send({
      toEmail: sellerEmail,
      subject: 'Status do pedido alterado',
      message: `
        Olá, os status do seu pedido - ${order.id} foi alterado para: ${TranslateOrderStatus[status]},
        qualquer dúvida entre em contato com o comprador por meio do email: ${sellerEmail}
      `,
    });

    if (status === 'CANCELED' && order.accountBonusId) {
      await this.changeBonusStatusRepository.changeBonusStatus({
        accountBonusId: order.accountBonusId,
        status: 'ACTIVE',
      });
    }

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

    if (status === 'CANCELED' || orderStatusSelected === 'CANCELED') {
      return {
        status: 'CANCELED',
        entity: entitySelected,
      };
    }

    if (orderStatusSelected === 'PENDING') {
      return {
        status: 'PENDING',
        entity: entitySelected,
      };
    }

    return {
      status: 'COMPLETED',
      entity: entitySelected,
    };
  }
}
