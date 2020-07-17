import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';
import { holidaySchema } from './holiday.schema';

@Module({
  controllers: [HolidayController],
  exports: [HolidayService],
  imports: [
    MongooseModule.forFeature([{ name: 'Holiday', schema: holidaySchema }]),
  ],
  providers: [HolidayService],
})
export class HolidayModule {}
