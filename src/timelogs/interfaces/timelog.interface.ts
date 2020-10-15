import { Types } from 'mongoose';

export interface ITimelog {
  _id: Types.ObjectId;
  desc: string;
  date: Date;
  project: Types.ObjectId;
  time: string;
  uid: Types.ObjectId;
}
