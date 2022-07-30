import { prisma } from '@/infra/db/helpers/connection.helper';
import { BonusPrismaRepository } from '@/infra/db/prisma/bonus';

describe('BonusPrismaRepository', () => {
  let sut: BonusPrismaRepository;

  beforeEach(async () => {
    await prisma.accountBonus.deleteMany({});
    await prisma.bonus.deleteMany({});

    sut = new BonusPrismaRepository();
  });

  describe('create', () => {
    it('should create bonus and return your id if called successfully', async () => {
      const params = {
        name: 'Bonus 1',
        description: 'Bonus 1 description',
        price: 10,
        duration: 1,
        type: 'coupon' as 'coupon',
        percent: 10,
      };

      const result = await sut.create(params);

      expect(result).toEqual({
        bonusId: expect.any(String),
      });
    });
  });

  describe('list', () => {
    it('should return coupon bonuses if called successfully', async () => {
      const params = {
        type: 'coupon' as 'coupon',
      };

      await sut.create({
        name: 'Bonus 1',
        description: 'Bonus 1 description',
        price: 10,
        duration: 1,
        type: 'coupon' as 'coupon',
        percent: 10,
      });

      await sut.create({
        name: 'Bonus 2',
        description: 'Bonus 2 description',
        price: 20,
        duration: 2,
        type: 'highlight' as 'highlight',
        percent: 20,
      });

      const result = await sut.list(params);

      expect(result).toEqual([{
        id: expect.any(String),
        name: 'Bonus 1',
        description: 'Bonus 1 description',
        price: 10,
        duration: 1,
        type: 'coupon',
        percent: 10,
      }]);
    });
    it('should return highlight bonuses if called successfully', async () => {
      const params = {
        type: 'highlight' as 'highlight',
      };

      await sut.create({
        name: 'Bonus 1',
        description: 'Bonus 1 description',
        price: 10,
        duration: 1,
        type: 'coupon' as 'coupon',
        percent: 10,
      });

      await sut.create({
        name: 'Bonus 2',
        description: 'Bonus 2 description',
        price: 20,
        duration: 2,
        type: 'highlight' as 'highlight',
        percent: 20,
      });

      const result = await sut.list(params);

      expect(result).toEqual([{
        id: expect.any(String),
        name: 'Bonus 2',
        description: 'Bonus 2 description',
        price: 20,
        duration: 2,
        type: 'highlight',
        percent: 20,
      }]);
    });
    it('should return all bonuses if called successfully without type', async () => {
      await sut.create({
        name: 'Bonus 1',
        description: 'Bonus 1 description',
        price: 10,
        duration: 1,
        type: 'coupon' as 'coupon',
        percent: 10,
      });

      await sut.create({
        name: 'Bonus 2',
        description: 'Bonus 2 description',
        price: 20,
        duration: 2,
        type: 'highlight' as 'highlight',
        percent: 20,
      });

      const result = await sut.list({
        type: undefined,
      });

      expect(result).toEqual([{
        id: expect.any(String),
        name: 'Bonus 1',
        description: 'Bonus 1 description',
        price: 10,
        duration: 1,
        type: 'coupon',
        percent: 10,
      },
      {
        id: expect.any(String),
        name: 'Bonus 2',
        description: 'Bonus 2 description',
        price: 20,
        duration: 2,
        type: 'highlight',
        percent: 20,
      }]);
    });
  });
});
