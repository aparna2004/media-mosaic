import { Test, TestingModule } from '@nestjs/testing';
import { TechotainmentController } from './techotainment.controller';
import { TechotainmentService } from './techotainment.service';

describe('TechotainmentController', () => {
  let techotainmentController: TechotainmentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TechotainmentController],
      providers: [TechotainmentService],
    }).compile();

    techotainmentController = app.get<TechotainmentController>(TechotainmentController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(techotainmentController.getHello()).toBe('Hello World!');
    });
  });
});
