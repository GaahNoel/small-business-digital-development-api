import { prisma } from '@/infra';

jest.setTimeout(30000);

prisma.$transaction([
  prisma.product.deleteMany(),
  prisma.category.deleteMany(),
  prisma.business.deleteMany(),
  prisma.account.deleteMany(),
]);
