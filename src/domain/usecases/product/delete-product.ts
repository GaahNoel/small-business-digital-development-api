export type DeleteProductParams = {
  productId: string;
};

export interface DeleteProduct {
  delete(DeleteProductParams: DeleteProduct.Params): Promise<DeleteProduct.Result>;
}
export namespace DeleteProduct {
  export type Params = DeleteProductParams;
  export type Result = {
    delete: boolean
    id: string
  };
}
