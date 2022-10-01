import { CreateWatchedVideoRepository } from '@/data/protocols/db/watched-video';
import { DbCreateWatchedVideo } from '@/data/usecases/watched-video';

describe('DbCreateWatchedVideo', () => {
  let dbCreateWatchedVideo: DbCreateWatchedVideo;
  let createWatchedVideoRepository: CreateWatchedVideoRepository;

  beforeAll(() => {
    createWatchedVideoRepository = {
      create: jest.fn(async () => Promise.resolve({
        watchedVideoId: 'any-id',
      })),
    };
  });

  beforeEach(() => {
    dbCreateWatchedVideo = new DbCreateWatchedVideo(createWatchedVideoRepository);
  });

  it('should call dbCreateWatchedVideo with correct params', async () => {
    await dbCreateWatchedVideo.create({
      accountId: 'any-account-id',
      url: 'any-url',
    });

    expect(createWatchedVideoRepository.create).toHaveBeenCalledWith({
      accountId: 'any-account-id',
      url: 'any-url',
    });
  });

  it('should return id called correctly', async () => {
    const response = await dbCreateWatchedVideo.create({
      accountId: 'any-account-id',
      url: 'any-url',
    });

    expect(response).toEqual({
      watchedVideoId: 'any-id',
    });
  });

  it('should throw error if createWatchedVideoRepository throws', async () => {
    (createWatchedVideoRepository.create as jest.Mock).mockImplementationOnce(async () => Promise.reject(new Error()));

    const promise = dbCreateWatchedVideo.create({
      accountId: 'any-account-id',
      url: 'any-url',
    });

    await expect(promise).rejects.toThrow();
  });
});
