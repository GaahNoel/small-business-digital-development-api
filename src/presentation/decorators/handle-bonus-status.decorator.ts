import { HandleBonusStatus } from '@/domain/usecases/bonus';
import { BaseController } from '../protocols';

export class HandleBonusStatusDecorator implements BaseController {
  constructor(private readonly controller: BaseController, private readonly handleBonusStatus: HandleBonusStatus) {}

  async handle(params: any): Promise<any> {
    await this.handleBonusStatus.handleStatus();
    return this.controller.handle(params);
  }
}
