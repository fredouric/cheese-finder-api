import { Module } from '@nestjs/common';
import { CheeseModule } from './cheese/cheese.module';

@Module({
  imports: [CheeseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
