import { Controller } from '@nestjs/common';
import { CheeseService } from './cheese.service';
import { Get } from '@nestjs/common';

@Controller('cheeses')
export class CheeseController {
  constructor(private readonly cheeseService: CheeseService) {}

  @Get()
  getCheeses() {
    return this.cheeseService.getAllCheeses();
  }
}
