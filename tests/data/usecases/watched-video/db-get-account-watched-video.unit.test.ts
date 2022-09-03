import { GetAccountWatchedVideosRepository } from '@/data/protocols/db/watched-video/get-account-watched-videos.repository';
import { DbGetAccountWatchedVideos } from '@/data/usecases/watched-video';

describe('DbGetAccountWatchedVideos', () => {
  let sut: DbGetAccountWatchedVideos;
  let getAccountWatchedVideosRepository: GetAccountWatchedVideosRepository;

  beforeAll(() => {
    getAccountWatchedVideosRepository = {
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
    sut = new DbGetAccountWatchedVideos(getAccountWatchedVideosRepository);
  });

  it('should call getAccountWatchedVideosRepository with correct params', async () => {
    await sut.getAccountVideos({
      accountId: 'any-account-id',
    });

    expect(getAccountWatchedVideosRepository.getAccountVideos).toHaveBeenCalledWith({
      accountId: 'any-account-id',
    });
  });

  it('should return correct response if called successfully ', async () => {
    const response = await sut.getAccountVideos({
      accountId: 'any-account-id',
    });

    expect(response).toEqual({
      videos: [{
        accountId: 'any-account-id',
        id: 'any-id',
        url: 'any-url',
      }],
    });
  });

  it('should throw error if getAccountWatchedVideosRepository throws ', async () => {
    (getAccountWatchedVideosRepository.getAccountVideos as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));

    await expect(
      sut.getAccountVideos({
        accountId: 'any-account-id',
      }),
    ).rejects.toThrow();
  });
});
