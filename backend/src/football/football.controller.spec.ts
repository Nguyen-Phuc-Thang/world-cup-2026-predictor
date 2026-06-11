import { Test, TestingModule } from '@nestjs/testing';
import { FootballController } from './football.controller';
import { FootballService } from './football.service';

describe('FootballController', () => {
  let controller: FootballController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FootballController],
      providers: [FootballService],
    }).compile();

    controller = module.get<FootballController>(FootballController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
