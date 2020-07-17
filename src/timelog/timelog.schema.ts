import * as mongoose from 'mongoose';

export const timelogSchema: mongoose.Schema = new mongoose.Schema(
  {
    desc: {
      required: true,
      type: String,
    },
    date: {
      required: true,
      type: Date,
    },
    project: {
      required: true,
      type: String,
    },
    time: {
      required: true,
      type: String,
    },
  },
  {
    versionKey: false,
  },
);
