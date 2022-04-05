export type AddCategoryParams = {
  name: string;
  description: string;
};

export interface AddCategory {
  add(AddCategoryParams: AddCategory.Params): Promise<AddCategory.Result>;
}
export namespace AddCategory {
  export type Params = AddCategoryParams;
  export type Result = {
    id: string
  };
}
