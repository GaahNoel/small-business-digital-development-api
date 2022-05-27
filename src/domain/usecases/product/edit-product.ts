export type EditProductParams = {
  productId: string;
  name?: string;
  description?: string;
  listPrice?: number;
  salePrice?: number;
  imageUrl?: string;
};

export interface EditProduct {
  edit(editProductParams: EditProduct.Params): Promise<EditProduct.Result>;
}
export namespace EditProduct {
  export type Params = EditProductParams;
  export type Result = {
    productId: string
  };
}
