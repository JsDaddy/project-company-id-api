import * as mongoose from 'mongoose';

export interface ITimelog {
  _id: mongoose.Schema.Types.ObjectId;
  desc: string;
  date: Date;
  project: mongoose.Schema.Types.ObjectId;
  time: string;
  user: mongoose.Schema.Types.ObjectId;
}
