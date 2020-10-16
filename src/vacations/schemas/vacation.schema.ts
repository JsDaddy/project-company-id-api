import { Types, Schema } from 'mongoose';

export const vacationSchema: Schema = new Schema(
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
    status: {
      required: true,
      type: String,
    },
    uid: {
      required: true,
      type: Types.ObjectId,
    },
  },
  {
    versionKey: false,
  },
);
