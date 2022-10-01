import { GetAccountById } from '@/domain/usecases/account';
import { GetAccountWatchedVideos } from '@/domain/usecases/watched-video';
import { MissingParamsError, NotFound } from '@/presentation/errors';
import { GetAccountWatchedVideosController } from '@/presentation/controller/watched-video';

describe('GetAccountWatchedVideosController', () => {
  let sut: GetAccountWatchedVideosController;
  let getAccountById: GetAccountById;
  let getAccountWatchedVideos: GetAccountWatchedVideos;

  beforeAll(() => {
    getAccountById = {
      getById: jest.fn(async () => Promise.resolve({
        name: 'any_name',
        email: 'email@email.com',
        verified: true,
        provider: 'credentials',
        balance: 10,
      })),
    };

    getAccountWatchedVideos = {
      getAccountVideos: jest.fn(async () => Promise.resolve({
        videos: [
          {
            accountId: 'any-account-id',
            id: 'any-id',
            url: 'any-url',
          },
        ],
      })),
    };
  });

  beforeEach(() => {
    sut = new GetAccountWatchedVideosController(getAccountById, getAccountWatchedVideos);
  });

  it('should throw error if account id was not provided', async () => {
    const response = sut.handle({
      accountId: null,
    });

    await expect(response).rejects.toThrow(new MissingParamsError({
      params: ['accountId'],
    }));
  });

  it('should call getAccountById with correct params', async () => {
    await sut.handle({
      accountId: 'any-account-id',
    });

    expect(getAccountById.getById).toHaveBeenCalledWith({
      accountId: 'any-account-id',
    });
  });

  it('should throw error if account not exists', async () => {
    (getAccountById.getById as jest.Mock).mockImplementationOnce(async () => Promise.reject(new NotFound({
      entity: 'Account',
    })));

    const response = sut.handle({
      accountId: 'any-account-id',
    });

    await expect(response).rejects.toThrow(new NotFound({
      entity: 'Account',
    }));
  });

  it('should call getAccountWatchedVideos with correct params', async () => {
    await sut.handle({
      accountId: 'any-account-id',
    });

    expect(getAccountWatchedVideos.getAccountVideos).toHaveBeenCalledWith({
      accountId: 'any-account-id',
    });
  });

  it('should return videos if called successfully', async () => {
    const response = await sut.handle({
      accountId: 'any-account-id',
    });

    expect(response).toEqual({
      statusCode: 200,
      body: {
        videos: [
          {
            accountId: 'any-account-id',
            id: 'any-id',
            url: 'any-url',
          },
        ],
      },
    });
  });

  it('should throw error if account not exists', async () => {
    (getAccountById.getById as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));

    const response = sut.handle({
      accountId: 'any-account-id',
    });

    await expect(response).rejects.toThrow(new Error());
  });
});
