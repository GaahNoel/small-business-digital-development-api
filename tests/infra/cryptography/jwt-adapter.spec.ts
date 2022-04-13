import faker from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { JwtAdapter } from '@/infra/cryptography';

const fakeToken = faker.datatype.uuid();
const fakeValue = faker.random.word();

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return Promise.resolve(fakeToken);
  },
  async verify(): Promise<string> {
    return Promise.resolve(fakeValue);
  },
}));

const makeSut = (): JwtAdapter => new JwtAdapter('secret');

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call jwt sign with correct values', async () => {
      const sut = makeSut();
      const fakeId = faker.datatype.uuid();

      const signSpy = jest.spyOn(jwt, 'sign');
      await sut.encrypt(fakeId);

      expect(signSpy).toHaveBeenCalledWith({ id: fakeId }, 'secret');
    });

    test('Should return a token on jwt sign success', async () => {
      const sut = makeSut();

      const accessToken = await sut.encrypt(faker.datatype.uuid());

      expect(accessToken).toBe(fakeToken);
    });

    test('Should throw if jwt sign throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });

      const promise = sut.encrypt(faker.datatype.uuid());

      await expect(promise).rejects.toThrow();
    });
  });

  describe('verify()', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');
      await sut.decrypt(fakeToken);
      expect(verifySpy).toHaveBeenCalledWith(fakeToken, 'secret');
    });

    test('Should return a value on verify success', async () => {
      const sut = makeSut();
      const value = await sut.decrypt(fakeToken);

      expect(value).toBe(fakeValue);
    });

    test('Should throw if verify throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error(); });
      const promise = sut.decrypt(fakeValue);

      await expect(promise).rejects.toThrow();
    });
  });
});
