import { ListBusinessById } from '@/domain/usecases/business';
import { UpdateActiveChallenge } from '@/domain/usecases/challenge/update-active-challenge';
import { ChallengeStrategy } from '@/presentation/interfaces';
import { calculateDistance } from '@/utils/calculate-distance';

export class BuyProximityStrategy implements ChallengeStrategy {
  constructor(private readonly updateActiveChallenge: UpdateActiveChallenge, private readonly getBusinessById: ListBusinessById) {}

  async handle({ challenge, orderInfos }: ChallengeStrategy.Params): Promise<ChallengeStrategy.Result> {
    const { businessId, latitude, longitude } = orderInfos;
    const business = await this.getBusinessById.list({
      businessId,
    });

    const distance = calculateDistance({
      originLatitude: latitude,
      originLongitude: longitude,
      destinationLatitude: Number(business.latitude),
      destinationLongitude: Number(business.longitude),
    });

    const newProgress = distance <= 5 ? challenge.progress + orderInfos.items.length : challenge.progress;

    const newStatus = newProgress === challenge.challenge.goal ? 'COMPLETED' : 'PENDING';

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
