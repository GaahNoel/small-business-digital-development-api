import { prisma } from '@/infra/db/helpers/connection.helper';
import { BonusPrismaRepository } from '@/infra/db/prisma/bonus';
import { AccountPrismaRepository } from '@/infra/db/prisma/account';
import { CreateBonusRepository } from '@/data/protocols/db/bonus';
import { AddAccountRepository } from '@/data';

describe('BonusPrismaRepository', () => {
  let sut: BonusPrismaRepository;
  let createAccountRepository = new AccountPrismaRepository();
  let createdBonus: CreateBonusRepository.Result;
  let createdAccount: AddAccountRepository.Result;

  beforeAll(async () => {
    await prisma.accountBonus.deleteMany({});
    await prisma.bonus.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.business.deleteMany({});
    await prisma.account.deleteMany({});

    createAccountRepository = new AccountPrismaRepository();
  });

  beforeEach(async () => {
    await prisma.accountBonus.deleteMany({});
    await prisma.bonus.deleteMany({});
    await prisma.account.deleteMany({});

    sut = new BonusPrismaRepository();

    createdAccount = await createAccountRepository.add({
      name: 'Account 1',
      email: 'teste@bonus.com',
      password: '123456',
      provider: 'credentials',
    });

    createdBonus = await sut.create({
      name: 'Bonus 1',
      description: 'Bonus 1 description',
      price: 10,
      duration: 1,
      type: 'coupon' as 'coupon',
      percent: 10,
    });
  });
  afterAll(async () => {
    await prisma.accountBonus.deleteMany({});
    await prisma.bonus.deleteMany({});
    await prisma.account.deleteMany({});
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
        name: 'Bonus 2',
        description: 'Bonus 2 description',
        price: 20,
        duration: 2,
        type: 'highlight' as 'highlight',
        percent: 20,
      });

      const result = await sut.list(params);

      expect(result).toEqual([
        {
          id: expect.any(String),
          name: 'Bonus 1',
          description: 'Bonus 1 description',
          price: 10,
          duration: 1,
          type: 'coupon',
          percent: 10,
        },
      ]);
    });
    it('should return highlight bonuses if called successfully', async () => {
      const params = {
        type: 'highlight' as 'highlight',
      };

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

  describe('createAccountBonus', () => {
    it('should create account bonus and return your id if called successfully', async () => {
      const params = {
        accountId: createdAccount.id,
        bonusId: createdBonus.bonusId,
        quantity: 1,
        measure: 'percent' as 'percent',
        value: 10,
      };

      const result = await sut.createAccountBonus(params);

      expect(result).toEqual({
        accountBonusId: expect.any(String),
      });
    });
  });

  describe('getAccountBonus', () => {
    it('should return account bonus if called successfully', async () => {
      const params = {
        accountId: createdAccount.id,
        bonusId: createdBonus.bonusId,
        quantity: 1,
        measure: 'percent' as 'percent',
        value: 10,
      };

      await sut.createAccountBonus(params);

      const result = await sut.getAccountBonus({
        accountId: createdAccount.id,
        type: 'coupon',
      });

      expect(result).toEqual([{
        id: expect.any(String),
        accountId: createdAccount.id,
        bonus: {
          id: createdBonus.bonusId,
          type: 'coupon' as 'coupon',
          duration: 1,
          price: 10,
          name: 'Bonus 1',
          description: 'Bonus 1 description',
          percent: 10,
        },
        quantity: 1,
        measure: 'percent' as 'percent',
        value: 10,
        status: 'ACTIVE',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }]);
    });

    it('should return account bonus if called successfully and with status', async () => {
      const params = {
        accountId: createdAccount.id,
        bonusId: createdBonus.bonusId,
        quantity: 1,
        measure: 'percent' as 'percent',
        value: 10,
      };

      await sut.createAccountBonus(params);

      const result = await sut.getAccountBonus({
        accountId: createdAccount.id,
        type: 'coupon',
        status: 'ACTIVE',
      });

      expect(result).toEqual([{
        id: expect.any(String),
        accountId: createdAccount.id,
        bonus: {
          id: createdBonus.bonusId,
          type: 'coupon' as 'coupon',
          duration: 1,
          price: 10,
          name: 'Bonus 1',
          description: 'Bonus 1 description',
          percent: 10,
        },
        quantity: 1,
        measure: 'percent' as 'percent',
        value: 10,
        status: 'ACTIVE',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }]);
    });
  });

  describe('getBonusById', () => {
    it('should return bonus if called successfully', async () => {
      const params = {
        accountId: createdAccount.id,
        bonusId: createdBonus.bonusId,
        quantity: 1,
        measure: 'percent' as 'percent',
        value: 10,
      };

      await sut.createAccountBonus(params);

      const result = await sut.getBonusById({
        bonusId: createdBonus.bonusId,
      });

      expect(result).toEqual({
        id: createdBonus.bonusId,
        type: 'coupon' as 'coupon',
        duration: 1,
        price: 10,
        name: 'Bonus 1',
        description: 'Bonus 1 description',
        percent: 10,
      });
    });
  });

  describe('getAccountBonusById', () => {
    it('should return account bonus if called successfully', async () => {
      const params = {
        accountId: createdAccount.id,
        bonusId: createdBonus.bonusId,
        quantity: 1,
        measure: 'percent' as 'percent',
        value: 10,
      };

      const createdAccountBonus = await sut.createAccountBonus(params);

      const result = await sut.getAccountBonusById({
        bonusId: createdAccountBonus.accountBonusId,
      });

      expect(result).toEqual({
        id: createdAccountBonus.accountBonusId,
        accountId: createdAccount.id,
        bonus: {
          id: createdBonus.bonusId,
          type: 'coupon' as 'coupon',
          duration: 1,
          price: 10,
          name: 'Bonus 1',
          description: 'Bonus 1 description',
          percent: 10,
        },
        quantity: 1,
        measure: 'percent' as 'percent',
        value: 10,
        status: 'ACTIVE',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('changeBonusStatus', () => {
    it('should change bonus status if called successfully', async () => {
      const params = {
        accountId: createdAccount.id,
        bonusId: createdBonus.bonusId,
        quantity: 1,
        measure: 'percent' as 'percent',
        value: 10,
      };

      const createdAccountBonus = await sut.createAccountBonus(params);

      const result = await sut.changeBonusStatus({
        accountBonusId: createdAccountBonus.accountBonusId,
        status: 'USED',
      });

      expect(result).toEqual({
        status: 'USED',
      });
    });
  });
});
