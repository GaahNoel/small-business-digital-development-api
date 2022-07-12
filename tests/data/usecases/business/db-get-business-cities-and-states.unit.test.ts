import { GetBusinessCitiesAndStatesRepository } from '@/data/protocols/db/business/get-business-cities-and-states.repository';
import { DbGetBusinessCitiesAndStates } from '@/data/usecases/business';

describe('DBGetBusinessCitiesAndStates', () => {
  let sut: DbGetBusinessCitiesAndStates;
  let getBusinessCitiesAndStatesRepository: GetBusinessCitiesAndStatesRepository;

  beforeAll(() => {
    getBusinessCitiesAndStatesRepository = {
      getCitiesAndStates: jest.fn(async () => Promise.resolve([
        {
          state: 'state-1',
          city: 'city-1',
        },
        {
          state: 'state-1',
          city: 'city-2',
        },
        {
          state: 'state-2',
          city: 'city-1',
        },
        {
          state: 'state-1',
          city: 'city-3',
        },
      ])),
    };
  });

  beforeEach(() => {
    sut = new DbGetBusinessCitiesAndStates(getBusinessCitiesAndStatesRepository);
  });

  it('should call getBusinessCitiesAndStatesRepository', async () => {
    await sut.getCitiesAndStates({});
    expect(getBusinessCitiesAndStatesRepository.getCitiesAndStates).toHaveBeenCalled();
  });

  it('should return a list of cities and states', async () => {
    const result = await sut.getCitiesAndStates({});
    expect(result).toEqual([
      {
        state: 'state-1',
        cities: ['city-1', 'city-2', 'city-3'],
      },
      {
        state: 'state-2',
        cities: ['city-1'],
      },
    ]);
  });

  it('should throw if getBusinessCitiesAndStatesRepository throws', async () => {
    (getBusinessCitiesAndStatesRepository.getCitiesAndStates as jest.Mock).mockImplementationOnce(async () => {
      throw new Error();
    });
    const promise = sut.getCitiesAndStates({});
    await expect(promise).rejects.toThrow();
  });
});
