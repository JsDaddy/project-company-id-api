import * as mongoose from 'mongoose';

export const ruleSchema: mongoose.Schema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
      unique: true,
    },
    desc: {
      required: true,
      type: String,
    },
  },
  {
    versionKey: false,
  },
);
