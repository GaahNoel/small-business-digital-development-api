type ListProductsByBusinessesParams = {
  businessesIds: string[];
  type: 'product' | 'service';
  location?: {
    latitude: string;
    longitude: string;
  }
};

export namespace ListProductsByBusinesses {
  export type Params = ListProductsByBusinessesParams;
  export type Result = {
    id: string;
    name: string;
    type: 'product' | 'service';
    description: string;
    listPrice: number;
    salePrice: number;
    imageUrl: string;
    business: {
      id: string;
      name: string;
      distance?: number;
    };
    category: {
      id: string;
      name: string;
    };
    createdAt?: Date;
  }[];
}

export interface ListProductsByBusinesses {
  listProductByBusinesses(data: ListProductsByBusinesses.Params): Promise<ListProductsByBusinesses.Result>;
}
