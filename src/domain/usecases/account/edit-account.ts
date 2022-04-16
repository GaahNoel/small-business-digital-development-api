export type EditAccountParams = {
  name?: string;
  email?: string;
  password?: string;
};

export namespace EditAccount {
  export type Params = EditAccountParams;
  export type Result = {
    id: string
    success: boolean
  };
}

export interface EditAccount {
  edit(editAccountParams: EditAccount.Params): Promise<EditAccount.Result>;
}
