export type ListCategoryParams = {};

export interface ListCategory {
  list(): Promise<ListCategory.Result>;
}
export namespace ListCategory {
  export type Params = ListCategoryParams;
  export type Result = [] | {
    id: string,
    name: string,
  }[];
}
