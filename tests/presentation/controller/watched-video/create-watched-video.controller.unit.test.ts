import { GetAccountById } from '@/domain/usecases/account';
import { CreateWatchedVideo } from '@/domain/usecases/watched-video';
import { CreateWatchedVideoController } from '@/presentation/controller/watched-video';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import { success } from '@/presentation/helpers/http.helpers';

const mockRequest = () => ({
  accountId: 'any-account-id',
  url: 'any-url',
});

describe('CreateWatchedVideoController', () => {
  let createWatchedVideoController: CreateWatchedVideoController;
  let createWatchedVideo: CreateWatchedVideo;
  let getAccountById: GetAccountById;

  beforeAll(() => {
    createWatchedVideo = {
      create: jest.fn(async () => Promise.resolve({
        watchedVideoId: 'any-id',
      })),
    };

    getAccountById = {
      getById: jest.fn(async () => Promise.resolve({
        name: 'any_name',
        email: 'email@email.com',
        verified: true,
        provider: 'credentials',
        balance: 10,
      })),
    };
  });

  beforeEach(() => {
    createWatchedVideoController = new CreateWatchedVideoController(createWatchedVideo, getAccountById);
  });

  it('should call getAccountById with correct params', async () => {
    await createWatchedVideoController.handle(mockRequest());

    expect(getAccountById.getById).toHaveBeenCalledWith({
      accountId: 'any-account-id',
    });
  });

  it('should call createWatchedVideo with correct params', async () => {
    await createWatchedVideoController.handle(mockRequest());

    expect(createWatchedVideo.create).toHaveBeenCalledWith({
      accountId: 'any-account-id',
      url: 'any-url',
    });
  });

  it('should return success if called successfully', async () => {
    const response = await createWatchedVideoController.handle(mockRequest());

    expect(response).toEqual(success({
      watchedVideoId: 'any-id',
    }));
  });

  it('should throw NotFound if called with invalid account id', async () => {
    (getAccountById.getById as jest.Mock).mockImplementationOnce(async () => Promise.resolve(null));

    const promise = createWatchedVideoController.handle(mockRequest());

    await expect(promise).rejects.toThrow(new NotFound({
      entity: 'Account',
    }));
  });

  it('should throw MissingParamsError if called without account id', async () => {
    const promise = createWatchedVideoController.handle({
      accountId: null,
    });

    await expect(promise).rejects.toThrow(new MissingParamsError({
      params: ['accountId'],
    }));
  });
});
