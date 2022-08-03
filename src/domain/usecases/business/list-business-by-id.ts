export type ListBusinessByIdParams = {
  businessId: string;
};

export interface ListBusinessById {
  list(ListBusinessParams: ListBusinessById.Params): Promise<ListBusinessById.Result>;
}
export namespace ListBusinessById {
  export type Params = ListBusinessByIdParams;
  export type Result = {
    id: string;
    name: string;
    description: string;
    accountId: string;
    imageUrl: string;
    latitude: String;
    longitude: String;
    street: String;
    city: String;
    state: String;
    zip: String;
    country: String;
    maxPermittedCouponPercentage: number;
  };
}
