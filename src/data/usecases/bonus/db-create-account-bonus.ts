import { CreateAccountBonusRepository } from '@/data/protocols/db/bonus';
import { GetAccountBonusRepository } from '@/data/protocols/db/bonus/get-account-bonus.repository';
import { GetBonusByIdRepository } from '@/data/protocols/db/bonus/get-bonus-by-id.repository';
import { BonusMeasure } from '@/domain/models/bonus';
import { CreateAccountBonus } from '@/domain/usecases/bonus';
import { MissingParamsError } from '@/presentation/errors';

export class DbCreateAccountBonus implements CreateAccountBonus {
  constructor(
    private readonly createAccountBonusRepository: CreateAccountBonusRepository,
    private readonly getBonusByIdRepository: GetBonusByIdRepository,
    private readonly getAccountBonusRepository: GetAccountBonusRepository,
  ) {}

  async createAccountBonus(params: CreateAccountBonus.Params): Promise<CreateAccountBonus.Result> {
    const bonus = await this.getBonusByIdRepository.getBonusById({ bonusId: params.bonusId });

    const value = bonus.type === 'coupon' ? bonus.percent : await this.calculatePriority(params);

    const additionalParams = bonus.type === 'highlight' ? { businessId: params.businessId } : {};

    if (bonus.type === 'highlight' && !params.businessId) {
      throw new MissingParamsError({
        params: ['businessId'],
      });
    }

    const createdAccountBonus = await this.createAccountBonusRepository.createAccountBonus({
      accountId: params.accountId,
      bonusId: params.bonusId,
      quantity: params.quantity,
      measure: CreateAccountBonus.bonusesMeasures[bonus.type as BonusMeasure],
      value,
      ...additionalParams,
    });

    return {
      accountBonusId: createdAccountBonus.accountBonusId,
    };
  }

  private async calculatePriority(params: CreateAccountBonus.Params): Promise<number> {
    const foundHighlightBonus = await this.getAccountBonusRepository.getAccountBonus({
      accountId: params.accountId,
      type: 'highlight',
    });
    return foundHighlightBonus.length;
  }
}
