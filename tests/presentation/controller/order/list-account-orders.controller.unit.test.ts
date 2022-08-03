import { ListAccountOrders } from '@/domain/usecases/order';
import { ListAccountOrdersController } from '@/presentation/controller/order';
import { MissingParamsError } from '@/presentation/errors';
import { success } from '@/presentation/helpers/http.helpers';

describe('ListAccountOrdersController', () => {
  const request = {
    accountId: 'any_account_id',
    type: 'buy' as 'buy',
  };

  let sut: ListAccountOrdersController;
  let listAccountOrders: ListAccountOrders;

  const mockedOrders = [
    {
      id: 'any_id',
      status: 'PENDING' as 'PENDING',
      items: [
        {
          id: expect.any(String),
          quantity: 1,
          product: {
            id: 'any_product_id',
            name: 'any_product_name',
            description: 'any_product_description',
            salePrice: 11111,
            listPrice: 11111,
            imageUrl: 'any_image_url',
          },
        },
      ],
      total: 0,
      sellerId: 'any_seller_id',
      buyerId: 'any_buyer_id',
      updatedAt: expect.any(Date),
      createdAt: expect.any(Date),
      Business: {
        id: 'any_business_id',
        name: 'any_business_name',
      },
    },
    {
      id: 'any_id',
      status: 'PENDING' as 'PENDING',
      items: [
        {
          id: expect.any(String),
          quantity: 1,
          product: {
            id: 'any_product_id',
            name: 'any_product_name',
            description: 'any_product_description',
            salePrice: 11111,
            listPrice: 11111,
            imageUrl: 'any_image_url',
          },
        },
      ],
      total: 0,
      sellerId: 'any_seller_id',
      buyerId: 'any_buyer_id',
      updatedAt: expect.any(Date),
      createdAt: expect.any(Date),
      Business: {
        id: 'any_business_id',
        name: 'any_business_name',
      },
    },
    {
      id: 'any_id',
      status: 'PENDING' as 'PENDING',
      items: [
        {
          id: expect.any(String),
          quantity: 1,
          product: {
            id: 'any_product_id',
            name: 'any_product_name',
            description: 'any_product_description',
            salePrice: 11111,
            listPrice: 11111,
            imageUrl: 'any_image_url',
          },
        },
      ],
      total: 0,
      sellerId: 'any_seller_id',
      buyerId: 'any_buyer_id',
      updatedAt: expect.any(Date),
      createdAt: expect.any(Date),
      Business: {
        id: 'any_other_business_id',
        name: 'any_other_business_name',
      },
    },
  ];

  beforeAll(() => {
    listAccountOrders = {
      listAccountOrders: jest.fn(async () => Promise.resolve(mockedOrders)),
    };
  });

  beforeEach(() => {
    sut = new ListAccountOrdersController(listAccountOrders);
  });

  it('should call listAccountOrders with correct params', async () => {
    await sut.handle(request);
    expect(listAccountOrders.listAccountOrders).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      type: 'buy',
    });
  });

  it('should return a list of orders on success', async () => {
    const response = await sut.handle(request);

    expect(response).toEqual(success([{
      business: {
        id: 'any_business_id',
        name: 'any_business_name',
      },
      orders: [{
        id: 'any_id',
        status: 'PENDING' as 'PENDING',
        items: [
          {
            id: expect.any(String),
            quantity: 1,
            product: {
              id: 'any_product_id',
              name: 'any_product_name',
              description: 'any_product_description',
              salePrice: 11111,
              listPrice: 11111,
              imageUrl: 'any_image_url',
            },
          },
        ],
        total: 0,
        sellerId: 'any_seller_id',
        buyerId: 'any_buyer_id',
        updatedAt: expect.any(Date),
        createdAt: expect.any(Date),
      },
      {
        id: 'any_id',
        status: 'PENDING' as 'PENDING',
        items: [
          {
            id: expect.any(String),
            quantity: 1,
            product: {
              id: 'any_product_id',
              name: 'any_product_name',
              description: 'any_product_description',
              salePrice: 11111,
              listPrice: 11111,
              imageUrl: 'any_image_url',
            },
          },
        ],
        total: 0,
        sellerId: 'any_seller_id',
        buyerId: 'any_buyer_id',
        updatedAt: expect.any(Date),
        createdAt: expect.any(Date),
      }],
    }, {
      business: {
        id: 'any_other_business_id',
        name: 'any_other_business_name',
      },
      orders: [{
        id: 'any_id',
        status: 'PENDING' as 'PENDING',
        items: [
          {
            id: expect.any(String),
            quantity: 1,
            product: {
              id: 'any_product_id',
              name: 'any_product_name',
              description: 'any_product_description',
              salePrice: 11111,
              listPrice: 11111,
              imageUrl: 'any_image_url',
            },
          },
        ],
        total: 0,
        sellerId: 'any_seller_id',
        buyerId: 'any_buyer_id',
        updatedAt: expect.any(Date),
        createdAt: expect.any(Date),
      }],
    },
    ]));
  });

  it.each([{
    params: {
      accountId: 'any_account_id',
      type: undefined as 'buy',
    },
    missing: ['type'],
  }, {
    params: {
      accountId: undefined,
      type: 'buy' as 'buy',
    },
    missing: ['accountId'],
  }])('should throw MissingParamsError if required params are missing', async ({ params, missing }) => {
    const response = sut.handle(params);
    await expect(response).rejects.toThrow(
      new MissingParamsError({
        params: missing,
      }),
    );
  });

  it('should throw error if throws unhandled error ', async () => {
    (listAccountOrders.listAccountOrders as jest.Mock).mockImplementation(async () => {
      throw new Error();
    });
    const response = sut.handle(request);
    await expect(response).rejects.toThrow(new Error());
  });
});
