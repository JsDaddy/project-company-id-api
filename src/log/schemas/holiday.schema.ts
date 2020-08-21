import * as mongoose from 'mongoose';

export const holidaySchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      unique: true,
    },
    date: {
      required: true,
      type: Date,
    },
  },
  {
    versionKey: false,
  },
);

type Holiday = {
  name: string;
  date: string;
};

export interface IHoliday extends mongoose.Document, Holiday {}
