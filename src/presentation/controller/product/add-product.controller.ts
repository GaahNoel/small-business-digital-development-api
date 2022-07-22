import { AddProduct } from '@/domain/usecases/product/add-product';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';
import { removeAuthParams } from '@/utils/handle-auth-params/remove-auth-params';

namespace AddProductController {
  export type Request = {
    name: string;
    type: 'product' | 'service';
    description: string;
    listPrice: number;
    salePrice: number;
    imageUrl: string;
    businessId: string;
    categoryId: string;
  };
}

export class AddProductController implements BaseController {
  constructor(
    private readonly addProduct: AddProduct,
  ) {}

  async handle(data: AddProductController.Request): Promise<HttpResponse> {
    try {
      const product = await this.addProduct.add({
        name: data.name,
        type: data.type,
        description: data.description,
        listPrice: data.listPrice,
        salePrice: data.salePrice,
        imageUrl: data.imageUrl,
        businessId: data.businessId,
        categoryId: data.categoryId,
      });

      return success({ id: product.id });
    } catch (error) {
      return internalServerError(error);
    }
  }
}
