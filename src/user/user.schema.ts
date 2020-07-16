import * as mongoose from 'mongoose';

export const userSchema: mongoose.Schema = new mongoose.Schema(
  {
    email: {
      required: true,
      type: String,
      unique: true,
    },
    username: {
      required: true,
      type: String,
    },
  },
  {
    versionKey: false,
  },
);
