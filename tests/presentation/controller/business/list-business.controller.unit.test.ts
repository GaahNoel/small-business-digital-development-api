import { ListBusiness } from '@/domain/usecases/business';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest, internalServerError } from '@/presentation/helpers/http.helpers';
import { ListBusinessController } from '@/presentation/controller/business/';

describe('ListBusinessController', () => {
  let sut: ListBusinessController;
  let listBusiness: ListBusiness;

  beforeAll(() => {
    listBusiness = {
      list: jest.fn(() => Promise.resolve([
        {
          id: 'any-id',
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
        },
      ])),
    };
  });

  beforeEach(() => {
    sut = new ListBusinessController(listBusiness);
  });

  describe('validate', () => {
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
        missing: ['latitude,longitude'],
      },
      {
        location: {
          latitude: 123, longitude: undefined, radius: undefined,
        },
        missing: ['longitude,radius'],
      },
      {
        location: {
          longitude: 123,
        },
        missing: ['latitude', 'radius'],
      },
    ])('should return MissingParamsError if location is missing', async (params: { location: { latitude: number, longitude:number, radius: number }, missing: string[] }) => {
      const result = await sut.handle({
        ...params.location,
      });

      expect(result).toEqual(badRequest(new MissingParamsError({
        params: params.missing,
      })));
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
      const result = await sut.handle({
        city: params.city.name,
        state: params.city.state,
      });

      expect(result).toEqual(badRequest(new MissingParamsError({
        params: params.missing,
      })));
    });
  });

  describe('handle', () => {
    it('should call ListBusiness with correct values', async () => {
      const params = {
        latitude: 123,
        longitude: 456,
        radius: 2,
        city: 'any-name',
        state: 'any-state',
      };

      await sut.handle(params);

      expect(listBusiness.list).toHaveBeenCalledWith({
        location: {
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius,
        },
        city: {
          name: params.city,
          state: params.state,
        },
      });
    });

    it('should return a list of businesses', async () => {
      const result = await sut.handle({
        latitude: 123,
        longitude: 456,
        radius: 2,
        city: 'any-name',
        state: 'any-state',
      });

      expect(result).toEqual({
        statusCode: 200,
        body: [
          {
            id: 'any-id',
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
          },
        ],
      });
    });

    it('should throw internalServerError if ListBusiness throws unhandled error', async () => {
      listBusiness.list = jest.fn(() => Promise.reject(new Error()));

      const result = await sut.handle({
        latitude: 123,
        longitude: 456,
        radius: 2,
        city: 'any-name',
        state: 'any-state',
      });

      expect(result).toEqual(internalServerError(new Error()));
    });
  });
});
