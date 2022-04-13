export type AddProductParams = {
  name: string;
  type: 'product' | 'service';
  description: string;
  listPrice: number;
  salePrice: number;
  imageUrl: string;
  businessId: string;
  categoryId: string;
};

export interface AddProduct {
  add(AddProductParams: AddProduct.Params): Promise<AddProduct.Result>;
}
export namespace AddProduct {
  export type Params = AddProductParams;
  export type Result = {
    id: string
  };
}
