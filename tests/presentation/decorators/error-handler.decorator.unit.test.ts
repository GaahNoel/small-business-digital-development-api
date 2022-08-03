import { ErrorHandlerDecorator } from '@/presentation/decorators/';
import {
  badRequest, internalServerError, notFound, success,
} from '@/presentation/helpers/http.helpers';
import { BaseController } from '@/presentation/protocols';
import { MissingParamsError, NotFound, InvalidParamsError } from '@/presentation/errors';

describe('ErrorHandlerDecorator', () => {
  let sut: ErrorHandlerDecorator;
  let controller: BaseController;

  beforeAll(() => {
    controller = {
      handle: jest.fn(async () => Promise.resolve(success({}))),
    };
  });

  beforeEach(() => {
    sut = new ErrorHandlerDecorator(controller);
  });

  it('should return controller return if no error occurs', async () => {
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(success({}));
  });

  it('should return not found if controller throws not found', async () => {
    (controller.handle as jest.Mock).mockReturnValueOnce(
      Promise.reject(new NotFound({
        entity: 'any',
      })),
    );

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(notFound(new NotFound({
      entity: 'any',
    })));
  });
  it('should return bad request if controller throws MissingParamsError', async () => {
    (controller.handle as jest.Mock).mockReturnValueOnce(
      Promise.reject(new MissingParamsError({
        params: ['any'],
      })),
    );

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(badRequest(new MissingParamsError({
      params: ['any'],
    })));
  });
  it('should return bad request if controller throws InvalidParamsError', async () => {
    (controller.handle as jest.Mock).mockReturnValueOnce(
      Promise.reject(new InvalidParamsError({
        params: ['any'],
      })),
    );

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(badRequest(new InvalidParamsError({
      params: ['any'],
    })));
  });
  it('should return internalServerError if controller throws unhandled error', async () => {
    (controller.handle as jest.Mock).mockReturnValueOnce(
      Promise.reject(new Error()),
    );

    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(internalServerError(new Error()));
  });
});
