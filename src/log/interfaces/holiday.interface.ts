import { Types } from 'mongoose';

export interface IHoliday {
  _id: Types.ObjectId;
  name: string;
  date: string;
}
