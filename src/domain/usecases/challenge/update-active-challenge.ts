export namespace UpdateActiveChallenge {
  export type Params = {
    activeChallengeId: string;
    progress: number;
    status: 'PENDING' | 'COMPLETED'
  };
  export type Result = {
    status: 'PENDING' | 'COMPLETED'
  };
}

export interface UpdateActiveChallenge {
  updateActiveChallenge(challenge: UpdateActiveChallenge.Params): Promise<UpdateActiveChallenge.Result>;
}
