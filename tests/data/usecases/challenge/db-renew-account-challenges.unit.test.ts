import { GetChallengeByIndexRepository, GetChallengeTotalCountRepository } from '@/data/protocols/db/challenge';
import { SetAccountChallengesRepository } from '@/data/protocols/db/challenge/set-account-challenges.repository';
import { DbRenewAccountChallenges } from '@/data/usecases/challenge';

describe('DbRenewAccountChallenges', () => {
  let sut: DbRenewAccountChallenges;
  let getChallengeTotalCount: GetChallengeTotalCountRepository;
  let getChallengeByIndex: GetChallengeByIndexRepository;
  let setAccountChallengesRepository: SetAccountChallengesRepository;

  beforeAll(() => {
    getChallengeTotalCount = {
      getTotalCount: jest.fn().mockReturnValue(Promise.resolve({ total: 1 })),
    };
    getChallengeByIndex = {
      getByIndex: jest.fn().mockReturnValue(Promise.resolve({ id: 'id' })),
    };
    setAccountChallengesRepository = {
      setAccountChallenges: jest.fn().mockReturnValue(Promise.resolve()),
    };
  });

  beforeEach(() => {
    sut = new DbRenewAccountChallenges(
      getChallengeTotalCount,
      getChallengeByIndex,
      setAccountChallengesRepository,
    );
  });

  it('should call GetChallengeTotalCountRepository ', async () => {
    await sut.renew({ accountId: 'any_account_id' });
    expect(getChallengeTotalCount.getTotalCount).toHaveBeenCalledWith({ periodicity: 'daily' });
    expect(getChallengeTotalCount.getTotalCount).toHaveBeenCalledWith({ periodicity: 'weekly' });
    expect(getChallengeTotalCount.getTotalCount).toHaveBeenCalledTimes(2);
  });

  it('should call GetChallengeByIndexRepository ', async () => {
    await sut.renew({ accountId: 'any_account_id' });
    expect(getChallengeByIndex.getByIndex).toHaveBeenCalledTimes(4);
  });

  it('should call SetAccountChallengesRepository with correct params', async () => {
    await sut.renew({ accountId: 'any_account_id' });
    expect(setAccountChallengesRepository.setAccountChallenges).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      challenges: [{ id: 'id' }, { id: 'id' }, { id: 'id' }, { id: 'id' }],
    });
  });

  it('should return challenges if renew successfully executed', async () => {
    const result = await sut.renew({ accountId: 'any_account_id' });
    expect(result).toEqual({ challenges: [{ id: 'id' }, { id: 'id' }, { id: 'id' }, { id: 'id' }] });
  });
});
