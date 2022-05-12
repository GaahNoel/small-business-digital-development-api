export type AddAccountParams = {
  name: string;
  email: string;
  password?: string;
  provider: 'facebook' | 'google' | 'credentials';
  verified?: boolean;
};

export namespace AddAccount {
  export type Params = AddAccountParams;
  export type Result = {
    id: string,
    created: boolean
  };
}

export interface AddAccount {
  add(addAccountParams: AddAccount.Params): Promise<AddAccount.Result>;
}
