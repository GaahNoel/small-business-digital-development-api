import { ListBusinessRepository } from '@/data/protocols/db/business';
import { ListBusiness, ListBusinessParams } from '@/domain/usecases/business/list-business';

export class DbListBusiness implements ListBusiness {
  constructor(private readonly listBusinessRepository: ListBusinessRepository) {}

  async list(params: ListBusinessParams): Promise<ListBusiness.Result> {
    if (this.isPropDefined(params.location)) {
      const businesses = await this.listBusinessRepository.list({});

      const nearbyBusinesses = businesses.filter((business) => {
        const distance = this.calculateDistance(
          {
            originLatitude: Number(business.latitude),
            originLongitude: Number(business.longitude),
            destinationLatitude: params.location.latitude,
            destinationLongitude: params.location.longitude,
          },
        );
        return distance <= params.location.radius;
      });

      return nearbyBusinesses;
    }

    if (this.isPropDefined(params.city)) {
      const businesses = await this.listBusinessRepository.list({
        city: {
          name: params.city.name.toLocaleLowerCase(),
          state: params.city.state.toLocaleLowerCase(),
        },
      });

      return businesses;
    }

    return this.listBusinessRepository.list({});
  }

  private calculateDistance = ({
    originLatitude,
    originLongitude,
    destinationLatitude,
    destinationLongitude,
  }: {
    originLatitude: number,
    originLongitude: number,
    destinationLatitude: number,
    destinationLongitude: number
  }): number => {
    const euclideanDistance = Math.sqrt((destinationLatitude - originLatitude) ** 2 + (destinationLongitude - originLongitude) ** 2);
    return euclideanDistance;
  };

  private isPropDefined(data: object) : boolean {
    if (!data) {
      return false;
    }
    return !Object.keys(data).some((prop) => data[prop] === undefined);
  }
}
