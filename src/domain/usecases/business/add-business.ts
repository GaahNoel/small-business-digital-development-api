export type AddBusinessParams = {
  name: string;
  imageUrl: string;
  accountId: string;
  description: string;
};

export interface AddBusiness {
  add(addBusinessParams: AddBusiness.Params): Promise<AddBusiness.Result>;
}
export namespace AddBusiness {
  export type Params = AddBusinessParams;
  export type Result = {
    id: string
  };
}
