export namespace HandleBonusStatus {
  export type Params = void;
  export type Result = void;
}

export interface HandleBonusStatus {
  handleStatus(params : HandleBonusStatus.Params): Promise<HandleBonusStatus.Result>
}
