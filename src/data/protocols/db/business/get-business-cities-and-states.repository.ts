import { GetBusinessCitiesAndStates } from '@/domain/usecases/business/get-business-cities-and-states';

export namespace GetBusinessCitiesAndStatesRepository {
  export type Params = GetBusinessCitiesAndStates.Params;
  export type Result =
    {
      state: string,
      city: string,
    }[];
}

export interface GetBusinessCitiesAndStatesRepository {
  getCitiesAndStates(params: GetBusinessCitiesAndStatesRepository.Params): Promise<GetBusinessCitiesAndStatesRepository.Result>;
}
