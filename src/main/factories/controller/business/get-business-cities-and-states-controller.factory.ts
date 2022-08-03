import { DbGetBusinessCitiesAndStates } from '@/data/usecases/business';
import { BusinessPrismaRepository } from '@/infra/db/prisma/business';
import { GetBusinessCitiesAndStatesController } from '@/presentation/controller/business';
import { ErrorHandlerDecorator } from '@/presentation/decorators';

export const makeGetBusinessCitiesAndStatesController = () => {
  const getBusinessCitiesAndStatesRepository = new BusinessPrismaRepository();

  const getBusinessCitiesAndStates = new DbGetBusinessCitiesAndStates(getBusinessCitiesAndStatesRepository);

  return new ErrorHandlerDecorator(new GetBusinessCitiesAndStatesController(getBusinessCitiesAndStates));
};
