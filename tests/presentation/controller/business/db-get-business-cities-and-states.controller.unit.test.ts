import { GetBusinessCitiesAndStates } from '@/domain/usecases/business/get-business-cities-and-states';
import { GetBusinessCitiesAndStatesController } from '@/presentation/controller/business';
import { NotFound } from '@/presentation/errors';
import { badRequest, internalServerError } from '@/presentation/helpers/http.helpers';

describe('GetBusinessCitiesAndStatesController', () => {
  let sut: GetBusinessCitiesAndStatesController;
  let getBusinessCitiesAndStates: GetBusinessCitiesAndStates;

  beforeAll(() => {
    getBusinessCitiesAndStates = {
      getCitiesAndStates: jest.fn(async () => Promise.resolve([{
        state: 'any_state',
        cities: ['any_city_1'],
      }])),
    };
  });

  beforeEach(() => {
    sut = new GetBusinessCitiesAndStatesController(getBusinessCitiesAndStates);
  });

  it('should return cities and states successfully', async () => {
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual({
      statusCode: 200,
      body: [{
        state: 'any_state',
        cities: ['any_city_1'],
      }],
    });
  });

  it('should return internalServerError if getCitiesAndStates throws', async () => {
    (getBusinessCitiesAndStates.getCitiesAndStates as jest.Mock).mockImplementation(async () => Promise.reject(new Error('any_error')));
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(internalServerError(new Error('any_error')));
  });

  it('should return bad request if no business found on db', async () => {
    (getBusinessCitiesAndStates.getCitiesAndStates as jest.Mock).mockImplementation(async () => Promise.resolve([]));
    const httpResponse = await sut.handle();
    expect(httpResponse).toEqual(badRequest(new NotFound({
      entity: 'Business',
      message: 'No business found on Db',
    })));
  });
});
