type GetBusinessCitiesAndStatesParams = {};

export namespace GetBusinessCitiesAndStates {
  export type Params = GetBusinessCitiesAndStatesParams;
  export type Result = {
    state: string,
    cities: string[],
  }[];
}

export interface GetBusinessCitiesAndStates {
  getCitiesAndStates(params: GetBusinessCitiesAndStates.Params): Promise<GetBusinessCitiesAndStates.Result>;
}
