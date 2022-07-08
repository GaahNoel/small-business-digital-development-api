import { AddProductRepository, GetProductByIdRepository, ListProductFromBusinessRepository } from '@/data/protocols/db/product';
import { DeleteProductRepository } from '@/data/protocols/db/product/delete-product.repository';
import { EditProductRepository } from '@/data/protocols/db/product/edit-product.repository';
import { ListProductsByBusinessesRepository } from '@/data/protocols/db/product/list-products-by-businesses.repository';
import { prisma } from '@/infra/db/helpers';

export class ProductPrismaRepository implements AddProductRepository, ListProductFromBusinessRepository, DeleteProductRepository, EditProductRepository, GetProductByIdRepository, ListProductsByBusinessesRepository {
  async add(data: AddProductRepository.Params): Promise<AddProductRepository.Result> {
    const product = await prisma.product.create({ data });
    return {
      productId: product.id,
    };
  }

  async list(data : ListProductFromBusinessRepository.Params): Promise<ListProductFromBusinessRepository.Result> {
    const products = await prisma.product.findMany({
      where: {
        businessId: data.businessId,
      },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        listPrice: true,
        salePrice: true,
        imageUrl: true,
        businessId: true,
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

  async edit(data: EditProductRepository.Params): Promise<EditProductRepository.Result> {
    const product = await prisma.product.update({
      where: {
        id: data.productId,
      },
      data: {
        name: data.name,
        description: data.description,
        listPrice: data.listPrice,
        salePrice: data.salePrice,
        imageUrl: data.imageUrl,
      },
    });

    return {
      productId: product.id,
    };
  }

  async get(data: GetProductByIdRepository.Params): Promise<GetProductByIdRepository.Result> {
    const product = await prisma.product.findFirst({
      where: {
        id: data.productId,
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

    if (!product) {
      return null;
    }

    return {
      name: product.name,
      type: product.type,
      description: product.description,
      listPrice: product.listPrice,
      salePrice: product.salePrice,
      imageUrl: product.imageUrl,
      businessId: product.businessId,
      category: product.category,
    };
  }

  async listProductByBusinesses(params: { businessesIds: string[]; type: 'service' | 'product'; location?: { latitude: string; longitude: string; }; }): Promise<ListProductsByBusinessesRepository.Result> {
    return prisma.product.findMany({
      where: {
        businessId: {
          in: params.businessesIds,
        },
        type: params.type,
      },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        listPrice: true,
        salePrice: true,
        imageUrl: true,
        createdAt: true,
        business: {
          select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
