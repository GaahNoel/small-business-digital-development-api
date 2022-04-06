import { AddProductRepository } from '@/data/protocols/db/product';
import { prisma } from '@/infra/db/helpers';

export class ProductPrismaRepository implements AddProductRepository {
  async add(data: AddProductRepository.Params): Promise<AddProductRepository.Result> {
    const product = await prisma.product.create({ data });
    return product;
  }
}
