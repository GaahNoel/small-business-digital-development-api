import { WithdrawAccountBalance } from '@/domain/usecases/account/withdraw-account-balance';
import { CreateAccountBonus, GetBonusById } from '@/domain/usecases/bonus';
import { MissingParamsError } from '@/presentation/errors';
import { InvalidParamsError } from '@/presentation/errors/invalid-params.error';
import { badRequest, internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace BuyBonusController {
  export type Params = {
    bonusId: string;
    quantity: number;
    accountId: string;
    businessId?: string;
  };
  export type Response = HttpResponse;
}
export class BuyBonusController implements BaseController {
  constructor(private readonly getBonusById: GetBonusById, private readonly createAccountBonus: CreateAccountBonus, private readonly withdrawAccountBalance: WithdrawAccountBalance) {}

  async handle(data: BuyBonusController.Params): Promise<BuyBonusController.Response> {
    this.validade(data);
    const bonus = await this.getBonusById.getById({
      bonusId: data.bonusId,
    });

    const updatedAccount = await this.withdrawAccountBalance.withdraw({
      accountId: data.accountId,
      amount: bonus.price * data.quantity,
    });

    const accountBonus = await this.createAccountBonus.createAccountBonus({
      bonusId: data.bonusId,
      quantity: data.quantity,
      accountId: data.accountId,
      businessId: data.businessId,
    });

    return success({
      newBalance: updatedAccount.newBalance,
      accountBonusId: accountBonus.accountBonusId,
    });
  }

  private validade(data: BuyBonusController.Params): void {
    const missingParams = [];

    if (!data.bonusId) {
      missingParams.push('bonusId');
    }

    if (!data.quantity) {
      missingParams.push('quantity');
    }

    if (!data.accountId) {
      missingParams.push('accountId');
    }

    if (missingParams.length > 0) {
      throw new MissingParamsError({
        params: missingParams,
      });
    }
  }
}
