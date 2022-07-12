import { DbGetBusinessCitiesAndStates } from '@/data/usecases/business';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { GetBusinessCitiesAndStatesController } from '@/presentation/controller/business';

export const makeGetBusinessCitiesAndStatesController = () => {
  const getBusinessCitiesAndStatesRepository = new BusinessPrismaRepository();

  const getBusinessCitiesAndStates = new DbGetBusinessCitiesAndStates(getBusinessCitiesAndStatesRepository);

  return new GetBusinessCitiesAndStatesController(getBusinessCitiesAndStates);
};
