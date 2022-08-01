import { ListBusiness } from '@/domain/usecases/business';
import { ListProductsByBusinesses } from '@/domain/usecases/product';
import { ListProductsByBusinessesController } from '@/presentation/controller/product';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import {
  success,
} from '@/presentation/helpers/http.helpers';

describe('ListProductsByBusinessesController', () => {
  let sut: ListProductsByBusinessesController;
  let listProductsByBusinesses: ListProductsByBusinesses;
  let listBusiness: ListBusiness;

  beforeAll(() => {
    listProductsByBusinesses = {
      listProductsByBusinesses: jest.fn(async () => Promise.resolve([{
        id: 'any_product_id',
        name: 'any_product_name',
        type: 'product' as 'product' | 'service',
        description: 'any_product_description',
        listPrice: 1,
        salePrice: 2,
        imageUrl: 'any_product_image_url',
        business: {
          id: 'any_product_business_id',
          name: 'any_product_business_name',
          distance: 1,
        },
        category: {
          id: 'any_product_category_id',
          name: 'any_product_category_name',
        },
        createdAt: new Date(),
      }])),
    };
    listBusiness = {
      list: jest.fn(async () => Promise.resolve([{
        id: 'any-business-id',
        name: 'any-name',
        description: 'any-description',
        imageUrl: 'any-imageUrl',
        latitude: 'any-latitude',
        longitude: 'any-longitude',
        street: 'any-street',
        city: 'any-city',
        state: 'any-state',
        zip: 'any-zip',
        country: 'any-country',
        maxPermittedCouponPercentage: 10,
      }])),
    };
  });

  beforeEach(() => {
    sut = new ListProductsByBusinessesController(listBusiness, listProductsByBusinesses);
  });

  it('should call ListBusiness and listProductsByBusinesses with correct values', async () => {
    const httpRequest = {
      type: 'product' as 'product' | 'service',
      latitude: 1,
      longitude: 2,
      radius: 3,
      city: 'any_city_name',
      state: 'any_city_state',
    };
    await sut.handle(httpRequest);
    expect(listBusiness.list).toHaveBeenCalledWith({
      location: {
        latitude: 1,
        longitude: 2,
        radius: 3,
      },
      city: {
        name: 'any_city_name',
        state: 'any_city_state',
      },
    });

    expect(listProductsByBusinesses.listProductsByBusinesses).toHaveBeenCalledWith({
      businessesIds: ['any-business-id'],
      type: 'product' as 'product' | 'service',
      location: {
        latitude: 1,
        longitude: 2,
        radius: 3,
      },
    });
  });

  it.each([
    {
      location: {
        longitude: 123, radius: 2, latitude: undefined,
      },
      missing: ['latitude'],
    },
    {
      location: {
        latitude: 123, radius: 2, longitude: undefined,
      },
      missing: ['longitude'],
    },
    {
      location: {
        latitude: 123, longitude: 2, radius: undefined,
      },
      missing: ['radius'],
    },
    {
      location: {
        radius: 2, latitude: undefined, longitude: undefined,
      },
      missing: ['latitude', 'longitude'],
    },
    {
      location: {
        latitude: 123, longitude: undefined, radius: undefined,
      },
      missing: ['longitude', 'radius'],
    },
    {
      location: {
        longitude: 123,
      },
      missing: ['latitude', 'radius'],
    },
  ])('should return MissingParamsError if location is missing', async (params: { location: { latitude: number, longitude:number, radius: number }, missing: string[] }) => {
    const result = sut.handle({
      ...params.location,
      type: 'product',
    });

    await expect(result).rejects.toThrow(new MissingParamsError({
      params: params.missing,
    }));
  });

  it.each([
    {
      city: {
        name: 'any-name',
        state: undefined,
      },
      missing: ['state'],
    },
    {
      city: {
        name: undefined,
        state: 'any-state',
      },
      missing: ['city'],
    },
  ])('should return MissingParamsError if city is missing', async (params: { city: { name: string, state: string }, missing: string[] }) => {
    const result = sut.handle({
      city: params.city.name,
      state: params.city.state,
      type: 'product',
    });

    await expect(result).rejects.toThrow(new MissingParamsError({
      params: params.missing,
    }));
  });

  it('should return MissingParamsError if type is missing', async () => {
    const result = sut.handle({
      type: undefined,
    });

    await expect(result).rejects.toThrow(new MissingParamsError({
      params: ['type'],
    }));
  });

  it('should return internalServerError if ListBusiness throws an error', async () => {
    (listBusiness.list as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));
    const result = sut.handle({
      type: 'product',
      latitude: 1,
      longitude: 2,
      radius: 3,
      city: 'any_city_name',
      state: 'any_city_state',
    });

    await expect(result).rejects.toThrow(new Error());
  });

  it('should return internalServerError if listProductsByBusinesses throws an error', async () => {
    (listProductsByBusinesses.listProductsByBusinesses as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));
    const result = sut.handle({
      type: 'product',
      latitude: 1,
      longitude: 2,
      radius: 3,
      city: 'any_city_name',
      state: 'any_city_state',
    });

    await expect(result).rejects.toThrow(new Error());
  });

  it('should return a list of products', async () => {
    const result = await sut.handle({
      type: 'product',
      latitude: 1,
      longitude: 2,
      radius: 3,
      city: 'any_city_name',
      state: 'any_city_state',
    });

    expect(result).toEqual(success([{
      id: 'any_product_id',
      name: 'any_product_name',
      type: 'product' as 'product' | 'service',
      description: 'any_product_description',
      listPrice: 1,
      salePrice: 2,
      imageUrl: 'any_product_image_url',
      business: {
        id: 'any_product_business_id',
        name: 'any_product_business_name',
        distance: 1,
      },
      category: {
        id: 'any_product_category_id',
        name: 'any_product_category_name',
      },
      createdAt: expect.any(Date),
    }]));
  });

  it('should return not found if businesses not found', async () => {
    (listBusiness.list as jest.Mock).mockImplementationOnce(async () => Promise.resolve([]));
    const result = sut.handle({
      type: 'product',
      latitude: 1,
      longitude: 2,
      radius: 3,
      city: 'any_city_name',
      state: 'any_city_state',
    });

    await expect(result).rejects.toThrow(new NotFound({
      entity: 'business',
    }));
  });
});
