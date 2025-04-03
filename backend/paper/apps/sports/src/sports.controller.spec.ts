import { Test, TestingModule } from '@nestjs/testing';
import { SportsController } from './sports.controller';
import { SportsService } from './sports.service';

describe('SportsController', () => {
  let sportsController: SportsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SportsController],
      providers: [SportsService],
    }).compile();

    sportsController = app.get<SportsController>(SportsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(sportsController.getHello()).toBe('Hello World!');
    });
  });
});
