import { Types, Schema } from 'mongoose';

export const timelogSchema: Schema = new Schema({
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
    type: Types.ObjectId,
  },
  time: {
    required: true,
    type: String,
  },
  uid: {
    required: true,
    type: Types.ObjectId,
  },
});
