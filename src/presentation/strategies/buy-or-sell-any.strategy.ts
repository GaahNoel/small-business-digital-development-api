import { ChallengeStrategy } from '@/presentation/interfaces';
import { UpdateActiveChallenge } from '@/domain/usecases/challenge/update-active-challenge';

export class BuyOrSellAnyStrategy implements ChallengeStrategy {
  constructor(private readonly updateActiveChallenge: UpdateActiveChallenge) {}

  async handle({ challenge }: ChallengeStrategy.Params): Promise<ChallengeStrategy.Result> {
    const newProgress = challenge.progress + 1;
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
