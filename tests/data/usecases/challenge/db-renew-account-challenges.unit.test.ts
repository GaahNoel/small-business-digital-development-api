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
    await sut.renew({ accountId: 'any_account_id', periodicity: 'daily' });
    expect(getChallengeTotalCount.getTotalCount).toHaveBeenCalledWith({ periodicity: 'daily' });
    expect(getChallengeTotalCount.getTotalCount).toHaveBeenCalledTimes(1);
  });

  it('should call GetChallengeByIndexRepository ', async () => {
    await sut.renew({ accountId: 'any_account_id', periodicity: 'daily' });
    expect(getChallengeByIndex.getByIndex).toHaveBeenCalledTimes(2);
  });

  it('should call SetAccountChallengesRepository with correct params', async () => {
    await sut.renew({ accountId: 'any_account_id', periodicity: 'daily' });
    expect(setAccountChallengesRepository.setAccountChallenges).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      challenges: [{ id: 'id' }, { id: 'id' }],
      periodicity: 'daily',
    });
  });

  it('should return challenges if renew successfully executed', async () => {
    const result = await sut.renew({ accountId: 'any_account_id', periodicity: 'daily' });
    expect(result).toEqual({ challenges: [{ id: 'id' }, { id: 'id' }] });
  });
});
