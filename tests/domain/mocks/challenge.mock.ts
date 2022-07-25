import { CreateChallenge } from '@/domain/usecases/challenge';

export const mockCreateChallengeParams = (): CreateChallenge.Params => ({
  description: 'any_description',
  type: 'buyAny',
  goal: 1,
  periodicity: 'daily',
  reward: 1,
});
