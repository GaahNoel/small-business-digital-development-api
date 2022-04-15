export type CheckAccountPasswordParams = {
  email: string;
  password: string;
};

export namespace CheckAccountPassword {
  export type Params = CheckAccountPasswordParams;
  export type Result = {
    match: boolean
  };
}

export interface CheckAccountPassword {
  check(addAccountParams: CheckAccountPassword.Params): Promise<CheckAccountPassword.Result>;
}
