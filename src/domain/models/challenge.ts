export type ActiveChallenge = {
  id: string;
  challengeId: string;
  accountId: string;
  progress: number;
  status: 'PENDING' | 'COMPLETED'
  createdAt?: Date
  updatedAt ?: Date
};

export type Challenge = {
  id: string;
  description: string;
  type: ChallengeType;
  goal: number;
  periodicity: Periodicity;
  reward: number;
  ActiveChallenge: ActiveChallenge[];
  createdAt?: Date
  updatedAt ?: Date
};

type Periodicity = 'daily' | 'weekly';

type ChallengeType = 'buyAny' | 'sellAny' | 'buyProximity' | 'buyback' | 'buyProduct' | 'buyService' | 'sellProduct' | 'sellService';
