import { ChallengeType, Periodicity } from '@/domain/models/challenge';
import { CreateChallenge } from '@/domain/usecases/challenge';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

namespace CreateChallengeController {
  export type Params = {
    description: string;
    type: ChallengeType;
    goal: number;
    periodicity: Periodicity;
    reward: number;
  };
  export type Result = HttpResponse;
}

export class CreateChallengeController implements BaseController {
  constructor(private readonly createChallenge: CreateChallenge) {}

  async handle(params: CreateChallengeController.Params): Promise<CreateChallengeController.Result> {
    try {
      const result = await this.createChallenge.create({
        description: params.description,
        type: params.type,
        goal: params.goal,
        periodicity: params.periodicity,
        reward: params.reward,
      });

      return success({
        challengeId: result.challengeId,
      });
    } catch (error) {
      return internalServerError(error);
    }
  }
}
