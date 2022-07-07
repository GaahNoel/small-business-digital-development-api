import { ListBusiness } from '@/domain/usecases/business';
import { MissingParamsError } from '@/presentation/errors';
import { badRequest } from '@/presentation/helpers/http.helpers';
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
        missing: ['location.latitude'],
      },
      {
        location: {
          latitude: 123, radius: 2, longitude: undefined,
        },
        missing: ['location.longitude'],
      },
      {
        location: {
          latitude: 123, longitude: 2, radius: undefined,
        },
        missing: ['location.radius'],
      },
      {
        location: {
          radius: 2, latitude: undefined, longitude: undefined,
        },
        missing: ['location.latitude,location.longitude'],
      },
      {
        location: {
          latitude: 123, longitude: undefined, radius: undefined,
        },
        missing: ['location.longitude,location.radius'],
      },
      {
        location: {
          longitude: 123,
        },
        missing: ['location.latitude', 'location.radius'],
      },
      {
        location: {},
        missing: ['location.latitude,location.longitude,location.radius'],
      }])('should return MissingParamsError if location is missing', async (params: { location: { latitude: number, longitude:number, radius: number }, missing: string[] }) => {
      const result = await sut.handle({
        location: params.location,
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
        missing: ['city.state'],
      },
      {
        city: {
          name: undefined,
          state: 'any-state',
        },
        missing: ['city.name'],
      },
    ])('should return MissingParamsError if city is missing', async (params: { city: { name: string, state: string }, missing: string[] }) => {
      const result = await sut.handle({
        city: params.city,
      });

      expect(result).toEqual(badRequest(new MissingParamsError({
        params: params.missing,
      })));
    });
  });

  describe('handle', () => {
    it('should call ListBusiness.list with correct values', async () => {
      const params = {
        location: {
          latitude: 123,
          longitude: 456,
          radius: 2,
        },
        city: {
          name: 'any-name',
          state: 'any-state',
        },
      };

      await sut.handle(params);

      expect(listBusiness.list).toHaveBeenCalledWith(params);
    });

    it('should return a list of businesses', async () => {
      const result = await sut.handle({
        location: {
          latitude: 123,
          longitude: 456,
          radius: 2,
        },
        city: {
          name: 'any-name',
          state: 'any-state',
        },
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
  });
});
