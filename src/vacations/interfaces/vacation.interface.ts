import { Types } from 'mongoose';

export interface IVacation {
  _id: Types.ObjectId;
  desc: string;
  date: string | Date;
  type: number;
  uid: Types.ObjectId;
  status: string;
}
