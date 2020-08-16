import * as mongoose from 'mongoose';

export const timelogSchema: mongoose.Schema = new mongoose.Schema({
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
  user: {
    required: true,
    type: String,
  },
});
type Timelog = {
  // _id: mongoose.Schema.Types.ObjectId;
  desc: string;
  date: string;
  project: mongoose.Schema.Types.ObjectId;
  time: string;
  user: mongoose.Schema.Types.ObjectId;
};

export interface ITimelog extends mongoose.Document, Timelog {}
