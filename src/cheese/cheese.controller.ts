import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Query,
} from '@nestjs/common';
import { CheeseService } from './cheese.service';
import { Get } from '@nestjs/common';
import { Cheese } from './interfaces/cheese.interface';

@Controller('cheeses')
export class CheeseController {
  constructor(private readonly cheeseService: CheeseService) {}

  @Get()
  getCheese(
    @Query('fromage') fromage: string,
    @Query('departement') departement: string,
  ) {
    if (fromage && departement) {
      return this.cheeseService.getCheeseWithNameAndDepartement(
        fromage,
        departement,
      );
    } else {
      return this.cheeseService.getAllCheeses();
    }
  }

  @Get('/search')
  searchCheese(@Query('fromage') fromage: string) {
    if (!fromage) {
      throw new BadRequestException(
        'Invalid name. Please provide a valid name for searching.',
      );
    }
    return this.cheeseService.searchCheese(fromage);
  }

  @Post()
  addCheese(@Body() cheese: Cheese) {
    return this.cheeseService.addCheese(cheese);
  }
}
