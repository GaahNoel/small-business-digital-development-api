export type EditBusinessParams = {
  businessId: string
  name?: string;
  imageUrl?: string;
  accountId: string;
  description?: string;
  latitude?: string
  longitude?: string
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
};

export interface EditBusiness {
  edit(editBusinessParams: EditBusiness.Params): Promise<EditBusiness.Result>;
}
export namespace EditBusiness {
  export type Params = EditBusinessParams;
  export type Result = {
    id: string
  };
}
