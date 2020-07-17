import * as mongoose from 'mongoose';

export const serviceSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      unique: true,
    },
  },
  {
    versionKey: false,
  },
);
