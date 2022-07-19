import { ListProductsByBusinessesRepository } from '@/data/protocols/db/product/list-products-by-businesses.repository';
import { ListProductsByBusinesses } from '@/domain/usecases/product';
import { NotFound } from '@/presentation/errors';

export class DbListProductsByBusinesses implements ListProductsByBusinesses {
  constructor(private readonly listProductsByBusinessesRepository: ListProductsByBusinessesRepository) {}

  async listProductsByBusinesses(data: ListProductsByBusinesses.Params): Promise<ListProductsByBusinesses.Result> {
    const products = await this.listProductsByBusinessesRepository.listProductsByBusinesses({
      businessesIds: data.businessesIds,
      type: data.type,
    });

    if (products.length <= 0) {
      throw new NotFound({
        entity: 'Product',
      });
    }

    if (this.isPropDefined(data.location)) {
      const productsWithDistance = products.map((product) => ({
        ...product,
        business: {
          ...product.business,
          distance: this.calculateDistance({
            originLatitude: Number(data.location.latitude),
            originLongitude: Number(data.location.longitude),
            destinationLatitude: Number(product.business.latitude),
            destinationLongitude: Number(product.business.longitude),
          }),
        },
      }));
      return productsWithDistance;
    }

    return products;
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
