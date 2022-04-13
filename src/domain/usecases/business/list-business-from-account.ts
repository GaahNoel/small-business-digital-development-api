export type ListBusinessFromAccountParams = {
  accountId: string;
};

export interface ListBusinessFromAccount {
  list(ListBusinessParams: ListBusinessFromAccount.Params): Promise<ListBusinessFromAccount.Result>;
}
export namespace ListBusinessFromAccount {
  export type Params = ListBusinessFromAccountParams;
  export type Result = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  }[];
}
