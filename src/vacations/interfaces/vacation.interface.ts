import { Types } from 'mongoose';

export interface IVacation {
  _id: Types.ObjectId;
  desc: string;
  date: string;
  type: number;
  time: string;
  user: Types.ObjectId;
}
