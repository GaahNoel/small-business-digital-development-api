import { BonusStatus, BonusType } from '@/domain/models/bonus';
import { GetAccountBonuses } from '@/domain/usecases/bonus';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import { InvalidParamsError } from '@/presentation/errors/invalid-params.error';
import {
  success,
} from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

export namespace GetAccountBonusesController {
  export type Params = {
    accountId: string;
    type: BonusType;
    status?: BonusStatus;
  };

  export type Result = HttpResponse;
}

export class GetAccountBonusesController implements BaseController {
  constructor(private readonly getAccountBonuses: GetAccountBonuses) {}

  async handle(data: GetAccountBonusesController.Params): Promise<GetAccountBonusesController.Result> {
    this.validate(data);
    const accountBonuses = await this.getAccountBonuses.getBonuses({
      accountId: data.accountId,
      type: data.type,
      status: data.status,
    });

    return success(accountBonuses);
  }

  private validate(data: GetAccountBonusesController.Params): void {
    const missingParams = [];
    if (!data.accountId) {
      missingParams.push('accountId');
    }

    if (!data.type) {
      missingParams.push('type');
    }

    if (missingParams.length > 0) {
      throw new MissingParamsError({
        params: missingParams,
      });
    }

    if (data.type !== 'coupon' && data.type !== 'highlight') {
      throw new InvalidParamsError({
        params: ['type'],
      });
    }
  }
}
