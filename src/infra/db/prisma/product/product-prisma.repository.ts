import { AddProductRepository } from '@/data/protocols/db/product';
import { ListProductFromBusiness } from '@/domain/usecases/product';
import { prisma } from '@/infra/db/helpers';

export class ProductPrismaRepository implements AddProductRepository, ListProductFromBusiness {
  async add(data: AddProductRepository.Params): Promise<AddProductRepository.Result> {
    const product = await prisma.product.create({ data });
    return product;
  }

  async list(data : ListProductFromBusiness.Params): Promise<ListProductFromBusiness.Result> {
    const products = await prisma.product.findMany({
      where: {
        businessId: data.businessId,
      },
    });

    return products;
  }
}
