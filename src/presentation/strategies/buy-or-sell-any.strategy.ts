import { ChallengeStrategy } from '@/presentation/interfaces';
import { UpdateActiveChallenge } from '@/domain/usecases/challenge/update-active-challenge';

export class BuyOrSellAnyStrategy implements ChallengeStrategy {
  constructor(private readonly updateActiveChallenge: UpdateActiveChallenge) {}

  async handle({ challenge, orderInfos }: ChallengeStrategy.Params): Promise<ChallengeStrategy.Result> {
    const newProgress = challenge.progress + orderInfos.items.length;

    const newStatus = newProgress === challenge.challenge.goal ? 'COMPLETED' : 'PENDING';

    const updatedChallenge = await this.updateActiveChallenge.updateActiveChallenge({
      activeChallengeId: challenge.id,
      progress: newProgress,
      status: newStatus,
    });

    return {
      status: updatedChallenge.status,
    };
  }
}
