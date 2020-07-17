import * as mongoose from 'mongoose';

export const typeSchema: mongoose.Schema = new mongoose.Schema(
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
