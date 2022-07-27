import { ChallengeStrategy } from '@/presentation/interfaces';
import { ChallengeInfos } from '@/domain/usecases/challenge';
import { UpdateActiveChallenge } from '@/domain/usecases/challenge/update-active-challenge';

export class BuyOrSellAnyStrategy implements ChallengeStrategy<ChallengeInfos> {
  constructor(private readonly updateActiveChallenge: UpdateActiveChallenge) {}

  async handle(params: ChallengeInfos): Promise<ChallengeStrategy.Result> {
    const newProgress = params.progress + 1;
    const newStatus = newProgress === params.challenge.goal ? 'COMPLETED' : 'PENDING';

    const updatedChallenge = await this.updateActiveChallenge.updateActiveChallenge({
      activeChallengeId: params.id,
      progress: newProgress,
      status: newStatus,
    });

    return {
      status: updatedChallenge.status,
    };
  }
}
