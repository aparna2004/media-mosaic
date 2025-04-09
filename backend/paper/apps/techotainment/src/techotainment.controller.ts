import { Controller } from '@nestjs/common';
import { TechotainmentService } from './techotainment.service';
import { MessagePattern } from '@nestjs/microservices';
import { Message } from '@app/types';

@Controller()
export class TechotainmentController {
  constructor(private readonly techotainmentService: TechotainmentService) {}

  @MessagePattern(Message.GET_TECH)
  getTech(data: {}): object {
    return this.techotainmentService.getTech();
  }
  
  @MessagePattern(Message.GET_ENTERTAINMENT)
  getEntertainment(data: {}): object {
    return this.techotainmentService.getEntertainment();
  }
}
