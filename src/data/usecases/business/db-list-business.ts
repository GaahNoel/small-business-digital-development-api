import { ListBusinessRepository } from '@/data/protocols/db/business';
import { ListBusiness, ListBusinessParams } from '@/domain/usecases/business/list-business';

export class DbListBusiness implements ListBusiness {
  constructor(private readonly listBusinessRepository: ListBusinessRepository) {}

  async list(params: ListBusinessParams): Promise<ListBusiness.Result> {
    if (params.location) {
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

    if (params.city) {
      const businesses = await this.listBusinessRepository.list({
        city: {
          name: params.city.name,
          state: params.city.state,
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
}
