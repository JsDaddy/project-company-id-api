import * as mongoose from 'mongoose';

export const stackSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      unique: true,
    },
    image: {
      required: false,
      type: String,
    },
  },
  {
    versionKey: false,
  },
);
