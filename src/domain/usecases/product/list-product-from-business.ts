export type ListProductFromBusinessParams = {
  businessId: string;
};

export interface ListProductFromBusiness {
  list(listProductFromBusiness: ListProductFromBusiness.Params): Promise<ListProductFromBusiness.Result>;
}
export namespace ListProductFromBusiness {
  export type Params = ListProductFromBusinessParams;
  export type Result = {
    id: string;
    name: string;
    type: 'product' | 'service';
    description: string;
    listPrice: number;
    salePrice: number;
    imageUrl: string;
    businessId: string;
    createdAt?: Date;
    category: {
      id: string;
      name: string;
    }
  }[];
}
