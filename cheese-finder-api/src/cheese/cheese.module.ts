import { Module } from '@nestjs/common';
import { CheeseService } from './cheese.service';
import { CheeseController } from './cheese.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CheeseService],
  controllers: [CheeseController],
})
export class CheeseModule {}
