export type GetProductByIdParams = {
  productId: string;
};

export interface GetProductById {
  get(getProductByIdParams: GetProductById.Params): Promise<GetProductById.Result>;
}
export namespace GetProductById {
  export type Params = GetProductByIdParams;
  export type Result = {
    name: string;
    type: 'product' | 'service';
    description: string;
    listPrice: number;
    salePrice: number;
    imageUrl: string;
    businessId: string;
    category: {
      id: string;
      name: string;
    };
  };
}
