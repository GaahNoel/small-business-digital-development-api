export namespace UpdateActiveChallengeRepository {
  export type Params = {
    activeChallengeId: string;
    progress: number;
    status: 'PENDING' | 'COMPLETED'
  };
  export type Result = {
    status: 'PENDING' | 'COMPLETED'
  };
}

export interface UpdateActiveChallengeRepository {
  updateActiveChallenge(challenge: UpdateActiveChallengeRepository.Params): Promise<UpdateActiveChallengeRepository.Result>;
}
