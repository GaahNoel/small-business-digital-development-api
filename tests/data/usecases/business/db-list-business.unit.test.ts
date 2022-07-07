import { ListBusinessRepository } from '@/data/protocols/db/business/';
import { DbListBusiness } from '@/data/usecases/business';

describe('DbListBusiness', () => {
  let sut : DbListBusiness;
  let listBusinessRepository: ListBusinessRepository;

  const makeBusiness = (latitude: string, longitude: string, city: string, state: string) => ({
    id: 'any_id',
    name: 'any_name',
    description: 'any-description',
    city,
    street: 'any_street',
    state,
    country: 'any_country',
    zip: 'any_zip',
    address: 'any_address',
    latitude,
    longitude,
    imageUrl: 'any_imageUrl',
  });

  beforeAll(() => {
    listBusinessRepository = {
      list: jest.fn(async () => [
        makeBusiness('3', '4', 'any_city', 'any_state'),
        makeBusiness('4', '3', 'any_city', 'any_state'),
        makeBusiness('2', '2', 'any_city', 'any_state'),
        makeBusiness('6', '8', 'any_city', 'any_state'),
        makeBusiness('9', '20', 'any_other_city', 'any_state'),
        makeBusiness('-10', '8', 'any_city', 'any_other_state'),
      ]),
    };
  });

  beforeEach(() => {
    sut = new DbListBusiness(listBusinessRepository);
  });

  it('should return all business if nothing', async () => {
    const result = await sut.list({});
    expect(result).toEqual([makeBusiness('3', '4', 'any_city', 'any_state'),
      makeBusiness('4', '3', 'any_city', 'any_state'),
      makeBusiness('2', '2', 'any_city', 'any_state'),
      makeBusiness('6', '8', 'any_city', 'any_state'),
      makeBusiness('9', '20', 'any_other_city', 'any_state'),
      makeBusiness('-10', '8', 'any_city', 'any_other_state'),
    ]);
  });

  it('should return all business from a city if it and state was provided', async () => {
    (listBusinessRepository.list as jest.Mock).mockImplementationOnce(async () => Promise.resolve([
      makeBusiness('3', '4', 'any_city', 'any_state'),
      makeBusiness('4', '3', 'any_city', 'any_state'),
      makeBusiness('2', '2', 'any_city', 'any_state'),
      makeBusiness('6', '8', 'any_city', 'any_state'),
    ]));

    const result = await sut.list({ city: { name: 'any_city', state: 'any_state' } });
    expect(result).toEqual([
      makeBusiness('3', '4', 'any_city', 'any_state'),
      makeBusiness('4', '3', 'any_city', 'any_state'),
      makeBusiness('2', '2', 'any_city', 'any_state'),
      makeBusiness('6', '8', 'any_city', 'any_state'),
    ]);
  });

  it('should return nearby business if latitude and longitude was provided', async () => {
    const result = await sut.list({ location: { latitude: 3, longitude: 4, radius: 5 } });
    expect(result).toEqual([
      makeBusiness('3', '4', 'any_city', 'any_state'),
      makeBusiness('4', '3', 'any_city', 'any_state'),
      makeBusiness('2', '2', 'any_city', 'any_state'),
      makeBusiness('6', '8', 'any_city', 'any_state'),
    ]);
  });

  it('should throw error if listBusinessRepository throws', async () => {
    (listBusinessRepository.list as jest.Mock).mockImplementation(() => {
      throw new Error();
    });

    const promise = sut.list({});
    await expect(promise).rejects.toThrow();
  });
});
