import { AddProductRepository } from '@/data/protocols/db/product';
import { DeleteProductRepository } from '@/data/protocols/db/product/delete-product.repository';
import { ListProductFromBusiness } from '@/domain/usecases/product';
import { prisma } from '@/infra/db/helpers';

export class ProductPrismaRepository implements AddProductRepository, ListProductFromBusiness, DeleteProductRepository {
  async add(data: AddProductRepository.Params): Promise<AddProductRepository.Result> {
    const product = await prisma.product.create({ data });
    return product;
  }

  async list(data : ListProductFromBusiness.Params): Promise<ListProductFromBusiness.Result> {
    const products = await prisma.product.findMany({
      where: {
        businessId: data.businessId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return products;
  }

  async delete(data: DeleteProductRepository.Params): Promise<DeleteProductRepository.Result> {
    const product = await prisma.product.delete({
      where: {
        id: data.productId,
      },
    });

    return {
      id: product.id,
    };
  }
}
