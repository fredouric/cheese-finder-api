import { Test, TestingModule } from '@nestjs/testing';
import { CheeseService } from './cheese.service';

describe('CheeseService', () => {
  let service: CheeseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheeseService],
    }).compile();

    service = module.get<CheeseService>(CheeseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
