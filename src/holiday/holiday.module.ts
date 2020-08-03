import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HolidayController } from './controllers/holiday.controller';
import { HolidayService } from './services/holiday.service';
import { holidaySchema } from './schemas/holiday.schema';

@Module({
  controllers: [HolidayController],
  exports: [HolidayService],
  imports: [
    MongooseModule.forFeature([{ name: 'holiday', schema: holidaySchema }]),
  ],
  providers: [HolidayService],
})
export class HolidayModule {}
