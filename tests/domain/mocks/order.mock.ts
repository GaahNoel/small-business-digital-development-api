import { CreateOrder } from '../usecases/order';

export const makeCreateOrderParams = (
  businessId = 'any_id',
  buyerId = 'any_id',
  sellerId = 'any_account_id',
): CreateOrder.Params => ({
  businessId,
  buyerId,
  sellerId,
  total: 20,
  description: 'any_description',
  paymentMethod: 'CreditCard',
  change: 10,
  items: [{
    quantity: 10,
    productId: 'any_product_id',
  }],
  latitude: 10,
  longitude: 10,
});
