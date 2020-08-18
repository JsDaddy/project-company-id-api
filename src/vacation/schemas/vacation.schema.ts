import * as mongoose from 'mongoose';

export const vacationSchema: mongoose.Schema = new mongoose.Schema(
  {
    desc: {
      required: true,
      type: String,
      unique: true,
    },
    date: {
      required: true,
      type: Date,
    },
    type: {
      required: true,
      type: Number,
    },
    uid: {
      required: true,
      type: mongoose.Types.ObjectId,
    },
  },
  {
    versionKey: false,
  },
);
type Vacation = {
  desc: string;
  date: string;
  type: number;
  time: string;
  user: mongoose.Schema.Types.ObjectId;
};

export interface IVacation extends mongoose.Document, Vacation {}
