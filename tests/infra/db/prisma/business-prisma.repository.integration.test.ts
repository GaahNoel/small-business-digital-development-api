import { AddBusinessRepository } from '@/data/protocols/db/business/add-business.repository';
import { mockAddBusinessParams } from '@/tests/domain/mocks/business.mock';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { prisma } from '@/infra/db/helpers';
import { mockAddAccountParams } from '@/tests/domain/mocks/account.mock';
import { AccountPrismaRepository } from '@/infra/db/prisma/account';
import {
  DeleteBusinessRepository, EditBusinessRepository, ListBusinessFromAccountRepository, ListBusinessRepository,
} from '@/data';
import { ListBusinessByIdRepository } from '@/data/protocols/db/business/list-business-by-id.repository';
import { GetBusinessCitiesAndStatesRepository } from '@/data/protocols/db/business/get-business-cities-and-states.repository';

type SutTypes = {
  sut: AddBusinessRepository & ListBusinessFromAccountRepository & DeleteBusinessRepository & EditBusinessRepository & ListBusinessByIdRepository & ListBusinessRepository & GetBusinessCitiesAndStatesRepository;
  addAccountRepository: AccountPrismaRepository;
};

const makeSut = (): SutTypes => {
  const sut = new BusinessPrismaRepository();
  const addAccountRepository = new AccountPrismaRepository();
  return {
    sut,
    addAccountRepository,
  };
};

describe('BusinessPrismaRepository', () => {
  const editBusinessParams = {
    businessId: 'any_id',
    name: 'any_name',
    imageUrl: 'any_image_url',
    accountId: 'any_account_id',
    description: 'any_description',
    latitude: 'any_latitude',
    longitude: 'any_longitude',
    street: 'any_street',
    city: 'any_city',
    state: 'any_state',
    zip: 'any_zip',
    country: 'any_country',
  };
  beforeEach(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.business.deleteMany({});
    await prisma.account.deleteMany({});
  });

  beforeAll(async () => {
    const deleteActiveChallenges = prisma.activeChallenge.deleteMany({});
    const deleteOrderItems = prisma.orderItem.deleteMany();
    const deleteOrders = prisma.order.deleteMany();
    const deleteProduct = prisma.product.deleteMany();
    const deleteCategory = prisma.category.deleteMany();
    const deleteBusiness = prisma.business.deleteMany();
    const deleteAccount = prisma.account.deleteMany();

    await prisma.$transaction([
      deleteActiveChallenges,
      deleteOrderItems,
      deleteOrders,
      deleteProduct,
      deleteCategory,
      deleteBusiness,
      deleteAccount,
    ]);

    await prisma.$disconnect();
  });

  describe('add', () => {
    it('should return business on add success ', async () => {
      const { sut, addAccountRepository } = makeSut();
      const account = mockAddAccountParams();
      const addedAccount = await addAccountRepository.add(account);

      const business = mockAddBusinessParams(addedAccount.id);
      const result = await sut.add(business);
      expect(result).toEqual({
        id: expect.anything(),
        createdAt: expect.anything(),
        ...business,
      });
    });
  });

  describe('list from account', () => {
    it('should list all business from accountId', async () => {
      const { sut, addAccountRepository } = makeSut();
      const account = mockAddAccountParams();

      const addedAccount = await addAccountRepository.add(account);

      const business = mockAddBusinessParams(addedAccount.id);
      const addedBusiness = await sut.add(business);

      const result = await sut.listFromAccount({
        accountId: addedAccount.id,
      });

      const { accountId, ...rest } = business;

      expect(result).toEqual([
        {
          ...rest,
          id: addedBusiness.id,
          createdAt: expect.anything(),
        },
      ]);
    });

    it('should return empty list accountId not have business', async () => {
      const { sut, addAccountRepository } = makeSut();
      const account = mockAddAccountParams();

      const addedAccount = await addAccountRepository.add(account);

      const result = await sut.listFromAccount({
        accountId: addedAccount.id,
      });

      expect(result).toEqual([]);
    });

    it('should return empty list if accountId not exists', async () => {
      const { sut } = makeSut();

      const result = await sut.listFromAccount({
        accountId: 'invalid-id',
      });

      expect(result).toEqual([]);
    });
  });

  describe('delete', () => {
    it('should return business on delete success', async () => {
      const { sut, addAccountRepository } = makeSut();
      const account = mockAddAccountParams();

      const addedAccount = await addAccountRepository.add(account);

      const business = mockAddBusinessParams(addedAccount.id);
      const addedBusiness = await sut.add(business);

      const result = await sut.delete({
        businessId: addedBusiness.id,
      });

      expect(result).toEqual({
        id: addedBusiness.id,
        delete: true,
      });
    });
  });

  describe('edit', () => {
    it('should return business id on edit success', async () => {
      const { sut, addAccountRepository } = makeSut();
      const account = mockAddAccountParams();

      const addedAccount = await addAccountRepository.add(account);

      const business = mockAddBusinessParams(addedAccount.id);
      const addedBusiness = await sut.add(business);

      const result = await sut.edit({
        ...editBusinessParams,
        businessId: addedBusiness.id,
      });

      expect(result).toEqual({
        id: addedBusiness.id,
      });
    });
  });

  describe('listById', () => {
    it('should return business on listById success', async () => {
      const { sut, addAccountRepository } = makeSut();
      const account = mockAddAccountParams();

      const addedAccount = await addAccountRepository.add(account);

      const business = mockAddBusinessParams(addedAccount.id);
      const addedBusiness = await sut.add(business);

      const result = await sut.listById({
        businessId: addedBusiness.id,
      });

      expect(result).toEqual({
        id: addedBusiness.id,
        ...business,
      });
    });
  });

  describe('list', () => {
    it('should return business on list success', async () => {
      const { sut, addAccountRepository } = makeSut();
      const account = mockAddAccountParams();

      const addedAccount = await addAccountRepository.add(account);

      const business = mockAddBusinessParams(addedAccount.id);
      const addedBusiness = await sut.add(business);

      const result = await sut.list({});

      expect(result).toEqual([
        {
          id: addedBusiness.id,
          ...business,
        },
      ]);
    });

    it('should return businesses of specific city', async () => {
      const { sut, addAccountRepository } = makeSut();
      const account = mockAddAccountParams();

      const addedAccount = await addAccountRepository.add(account);

      const business = mockAddBusinessParams(addedAccount.id);
      const otherCityBusiness = mockAddBusinessParams(addedAccount.id);
      otherCityBusiness.city = 'other_city';

      await sut.add(business);
      const otherCityAddedBusiness = await sut.add(otherCityBusiness);

      const result = await sut.list({ city: { name: 'other_city', state: 'any_state' } });

      expect(result).toEqual([
        {
          id: otherCityAddedBusiness.id,
          ...otherCityBusiness,
        },
      ]);
    });
  });

  describe('getBusinessCitiesAndStates', () => {
    it('should return state and cities ', async () => {
      const { sut, addAccountRepository } = makeSut();
      const addedAccount = await addAccountRepository.add(mockAddAccountParams());
      await sut.add(mockAddBusinessParams(addedAccount.id));

      const result = await sut.getCitiesAndStates({});

      expect(result).toEqual([
        {
          state: 'any_state',
          city: 'any_city',
        },
      ]);
    });
  });
});
