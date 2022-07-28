import { UpdateActiveChallenge } from '@/domain/usecases/challenge/update-active-challenge';
import { ChallengeData, ChallengeStrategy } from '../interfaces';

export class BuyOrSellAnyOnlyProductOrService implements ChallengeStrategy {
  constructor(private readonly updateActiveChallenge: UpdateActiveChallenge) {}

  async handle({ challenge, orderInfos }: ChallengeData): Promise<ChallengeStrategy.Result> {
    const challengeType = challenge.challenge.type;
    const challengeMatchProducts = orderInfos.items.filter((item) => {
      if (challengeType.toLocaleLowerCase().includes(item.product.type)) {
        return true;
      }
      return false;
    });

    const additionalProgress = challengeMatchProducts.length;

    if (additionalProgress === 0) {
      return {
        status: 'PENDING',
      };
    }

    const newProgress = challenge.progress + additionalProgress;
    const newStatus = newProgress >= challenge.challenge.goal ? 'COMPLETED' : 'PENDING';

    await this.updateActiveChallenge.updateActiveChallenge({
      activeChallengeId: challenge.id,
      progress: newProgress,
      status: newStatus,
    });

    return {
      status: newStatus,
    };
  }
}
