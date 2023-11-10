import { Module } from '@nestjs/common';
import { CheeseService } from './cheese.service';
import { CheeseController } from './cheese.controller';

@Module({
  providers: [CheeseService],
  controllers: [CheeseController],
})
export class CheeseModule {}
