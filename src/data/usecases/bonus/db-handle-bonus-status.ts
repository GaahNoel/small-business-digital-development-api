import { ChangeBonusStatusRepository } from '@/data/protocols/db/bonus';
import { ListAccountBonusRepository } from '@/data/protocols/db/bonus/list-account-bonuses.repository';
import { HandleBonusStatus } from '@/domain/usecases/bonus';

export class DbHandleBonusStatus implements HandleBonusStatus {
  constructor(private readonly listAccountBonusRepository: ListAccountBonusRepository, private readonly changeBonusStatusRepository:ChangeBonusStatusRepository) {}

  async handleStatus(): Promise<HandleBonusStatus.Result> {
    const bonuses = await this.listAccountBonusRepository.listAccountBonuses({});

    const expiredBonuses = bonuses.filter((bonus) => {
      const expireDate = new Date(bonus.createdAt);
      expireDate.setDate(expireDate.getDate() + bonus.bonus.duration);

      return expireDate < new Date();
    });

    const promises = expiredBonuses.map(async (expiredBonus) => {
      await this.changeBonusStatusRepository.changeBonusStatus({
        accountBonusId: expiredBonus.id,
        status: 'EXPIRED',
      });
    });

    await Promise.all(promises);
  }
}
