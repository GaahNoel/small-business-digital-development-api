import { CreateChallenge } from '@/domain/usecases/challenge';

export const mockCreateChallengeParams = (periodicity:'daily' | 'weekly' = 'daily'): CreateChallenge.Params => ({
  description: 'any_description',
  type: 'buyAny',
  goal: 1,
  periodicity,
  reward: 1,
});
