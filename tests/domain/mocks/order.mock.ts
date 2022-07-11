import { CreateOrder } from '../usecases/order';

export const makeCreateOrderParams = (
  businessId = 'any_id',
  buyerId = 'any_id',
): CreateOrder.Params => ({
  businessId,
  buyerId,
  total: 1,
  items: [{
    quantity: 1,
    productId: 'any_product_id',
  }],
});
