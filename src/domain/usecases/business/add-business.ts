import { BusinessModel } from '@/domain/models/business';

export type AddBusinessParams = {
  name: string;
  email: string;
  password?: string;
};

export interface AddBusiness {
  add(addAccountParams: AddBusinessParams): Promise<BusinessModel>;
}

export namespace AddBusiness {
  export type Params = AddBusinessParams;
  export type Result = BusinessModel;
}
