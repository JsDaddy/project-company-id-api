import { Types } from 'mongoose';

export interface IVacation {
  _id: Types.ObjectId;
  desc: string;
  date: string;
  type: number;
  uid: Types.ObjectId;
  status: string;
}
