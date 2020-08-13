import * as mongoose from 'mongoose';

export interface ITimelog {
  project: string;
  _id: mongoose.Types.ObjectId;
  uid: any;
  time: string;
  date: any;
  desc: string;
}
