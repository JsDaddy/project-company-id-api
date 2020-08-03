import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { HolidayDto } from '../dto/holiday.dto';

@Injectable()
export class HolidayService {
  public constructor(
    @InjectModel('holiday') private readonly holidayModel: Model<any>,
  ) {}

  public async createHoliday(holiday: HolidayDto): Promise<HolidayDto> {
    const createdHoliday = new this.holidayModel(holiday);
    return createdHoliday.save();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async findHolidays() {
    return this.holidayModel
      .find({})
      .lean()
      .exec();
  }
}
