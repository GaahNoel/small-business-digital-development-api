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
