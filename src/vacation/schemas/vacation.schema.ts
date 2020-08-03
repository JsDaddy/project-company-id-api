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
      type: String,
    },
  },
  {
    versionKey: false,
  },
);
