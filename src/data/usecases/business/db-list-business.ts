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
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

    const R = 6371;
    const dLat = deg2rad(destinationLatitude - originLatitude);
    const dLon = deg2rad(destinationLongitude - originLongitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(deg2rad(destinationLatitude)) * Math.cos(deg2rad(originLatitude))
        * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Number(distance.toFixed(2));
  };

  private isPropDefined(data: object) : boolean {
    if (!data) {
      return false;
    }
    return !Object.keys(data).some((prop) => data[prop] === undefined);
  }
}
