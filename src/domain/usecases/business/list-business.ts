export type ListBusinessParams = {
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  }
  city?: {
    name: string;
    state: string;
  }
};

export interface ListBusiness {
  list(params: ListBusiness.Params): Promise<ListBusiness.Result>;
}

export namespace ListBusiness {
  export type Params = ListBusinessParams;
  export type Result = {
    id: String;
    name: String;
    description: String;
    imageUrl: String;
    latitude: String;
    longitude: String;
    street: String;
    city: String;
    state: String;
    zip: String;
    country: String;
    maxPermittedCouponPercentage: number;
  }[];
}
