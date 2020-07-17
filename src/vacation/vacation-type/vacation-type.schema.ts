import * as mongoose from 'mongoose';

export const vacationTypeSchema: mongoose.Schema = new mongoose.Schema(
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
