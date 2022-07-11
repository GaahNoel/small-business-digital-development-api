import { GetBusinessCitiesAndStatesRepository } from '@/data/protocols/db/business/get-business-cities-and-states.repository';
import { GetBusinessCitiesAndStates } from '@/domain/usecases/business/get-business-cities-and-states';

export class DbGetBusinessCitiesAndStates implements GetBusinessCitiesAndStates {
  constructor(private readonly getBusinessCitiesAndStatesRepository: GetBusinessCitiesAndStatesRepository) {}

  async getCitiesAndStates(params: GetBusinessCitiesAndStates.Params): Promise<GetBusinessCitiesAndStates.Result> {
    const result = await this.getBusinessCitiesAndStatesRepository.getCitiesAndStates(params);

    const formattedResult: { state: string, cities: string[] }[] = [];
    result.forEach((item) => {
      const foundPosition = formattedResult.findIndex((position) => position.state === item.state);
      if (foundPosition !== -1) {
        formattedResult[foundPosition].cities.push(item.city);
      } else {
        formattedResult.push({
          state: item.state,
          cities: [item.city],
        });
      }
    });

    return formattedResult;
  }
}
