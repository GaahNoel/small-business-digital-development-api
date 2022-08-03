import { HandleBonusStatus } from '@/domain/usecases/bonus';
import { HandleBonusStatusDecorator } from '@/presentation/decorators';
import { success } from '@/presentation/helpers/http.helpers';
import { BaseController } from '@/presentation/protocols';

describe('HandleBonusStatusDecorator', () => {
  let sut: HandleBonusStatusDecorator;
  let handleBonusStatus: HandleBonusStatus;
  let controller : BaseController;

  beforeAll(() => {
    handleBonusStatus = {
      handleStatus: jest.fn(async () => Promise.resolve()),
    };

    controller = {
      handle: jest.fn(async () => Promise.resolve(success({
        status: 'EXPIRED',
      }))),
    };
  });

  beforeEach(() => {
    sut = new HandleBonusStatusDecorator(controller, handleBonusStatus);
  });

  it('should call handleBonusStatus one time', async () => {
    await sut.handle({});
    expect(handleBonusStatus.handleStatus).toHaveBeenCalledTimes(1);
  });

  it('should call controller with correct params', async () => {
    await sut.handle({ input: 'teste' });
    expect(controller.handle).toHaveBeenCalledWith({ input: 'teste' });
  });
  it('should return the same result of controller', async () => {
    const httpResponse = await sut.handle({ input: 'teste' });
    expect(httpResponse).toEqual(success({
      status: 'EXPIRED',
    }));
  });

  it('should throw error if controller throws', async () => {
    (controller.handle as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error('any_error')));
    const promise = sut.handle({ input: 'teste' });
    await expect(promise).rejects.toThrow();
  });
  it('should throw error if handleBonusStatus throws', async () => {
    (handleBonusStatus.handleStatus as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error('any_error')));
    const promise = sut.handle({ input: 'teste' });
    await expect(promise).rejects.toThrow();
  });
});
