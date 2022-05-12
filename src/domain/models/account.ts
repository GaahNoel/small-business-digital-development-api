export type AccountModel = {
  id: string;
  name: string;
  password?: string;
  email: string;
  createdAt?: Date;
  businessIds?: string[]
  verified: boolean;
  provider: 'credentials' | 'socialMedia';
};
