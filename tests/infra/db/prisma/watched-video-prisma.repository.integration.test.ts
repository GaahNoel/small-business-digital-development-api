import { AddAccountRepository } from '@/data';
import { mockAddAccountParams } from '@/tests/domain/mocks/account.mock';
import { AccountPrismaRepository } from '@/infra/db/prisma/account';
import { prisma } from '@/infra/db/helpers';
import { WatchedVideoPrismaRepository } from '@/infra/db/prisma/watched-video';

describe('WatchedVideoPrismaRepository', () => {
  let watchedVideoPrismaRepository: WatchedVideoPrismaRepository;
  let addedAccount: AddAccountRepository.Result;

  beforeAll(async () => {
    const addAccountRepository = new AccountPrismaRepository();
    addedAccount = await addAccountRepository.add(mockAddAccountParams());
  });

  beforeEach(() => {
    watchedVideoPrismaRepository = new WatchedVideoPrismaRepository();
  });

  afterAll(async () => {
    await prisma.accountWatchedVideos.deleteMany({});
    await prisma.account.deleteMany({});
  });

  describe('create', () => {
    it('should create new watched video successfully', async () => {
      const response = await watchedVideoPrismaRepository.create({
        accountId: addedAccount.id,
        url: 'any-url',
      });

      expect(response).toEqual({
        watchedVideoId: expect.any(String),
      });
    });
  });
});
