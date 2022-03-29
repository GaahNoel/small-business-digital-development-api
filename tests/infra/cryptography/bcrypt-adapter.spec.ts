import faker from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { BcryptAdapter } from '@/infra/cryptography';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hash');
  },

  async compare(): Promise<boolean> {
    return Promise.resolve(true);
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => new BcryptAdapter(salt);

let fakeValue: string;
let fakeHash: string;

describe('Bcrypt Adapter', () => {
  beforeEach(() => {
    fakeValue = faker.random.word();
    fakeHash = faker.random.word();
  });

  describe('hash()', () => {
    test('Should call bcrypt hash with correct values', async () => {
      const sut = makeSut();
      const hashSpy = jest.spyOn(bcrypt, 'hash');
      await sut.hash(fakeValue);

      expect(hashSpy).toHaveBeenCalledWith(fakeValue, salt);
    });

    test('Should return a valid hash on bcrypt hash success', async () => {
      const sut = makeSut();
      const hash = await sut.hash(fakeValue);

      expect(hash).toBe('hash');
    });

    test('Should throw if bcrypt hash throws', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.hash(fakeValue);

      await expect(promise).rejects.toThrow();
    });
  });

  describe('compare()', () => {
    test('Should call bcrypt compare with correct values', async () => {
      const sut = makeSut();
      const compareSpy = jest.spyOn(bcrypt, 'compare');
      await sut.compare(fakeValue, fakeHash);

      expect(compareSpy).toHaveBeenCalledWith(fakeValue, fakeHash);
    });

    test('Should return false when bcrypt compare fails', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);

      const isValid = await sut.compare(fakeValue, fakeHash);

      expect(isValid).toBe(false);
    });

    test('Should return true when bcrypt compare succeeds', async () => {
      const sut = makeSut();

      const isValid = await sut.compare(fakeValue, fakeHash);

      expect(isValid).toBe(true);
    });

    test('Should throw if bcrypt compare throws', async () => {
      const sut = makeSut();
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.compare(fakeValue, fakeHash);

      await expect(promise).rejects.toThrow();
    });
  });
});
