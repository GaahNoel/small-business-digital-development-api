export type HttpResponse<T = any> = {
  statusCode: number;
  body: T;
};

export type HttpRequest = {
  body?: any;
  headers?: any;
  params?: any;
  accountId?: string;
};
