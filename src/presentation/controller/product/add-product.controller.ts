import { AddProduct } from '@/domain/usecases/product/add-product';
import { internalServerError, success } from '@/presentation/helpers/http.helpers';
import { BaseController, HttpResponse } from '@/presentation/protocols';

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
      const product = await this.addProduct.add(data);

      return success({ id: product.id });
    } catch (error) {
      return internalServerError(error);
    }
  }
}
