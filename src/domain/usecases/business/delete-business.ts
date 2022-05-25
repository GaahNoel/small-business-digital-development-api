export type DeleteBusinessParams = {
  businessId: string;
};

export interface DeleteBusiness {
  delete(deleteBusinessParams: DeleteBusiness.Params): Promise<DeleteBusiness.Result>;
}
export namespace DeleteBusiness {
  export type Params = DeleteBusinessParams;
  export type Result = {
    delete: boolean
    id: string
  };
}
