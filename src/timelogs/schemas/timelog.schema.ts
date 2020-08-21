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
    type: mongoose.Types.ObjectId,
  },
  time: {
    required: true,
    type: String,
  },
  uid: {
    required: true,
    type: mongoose.Types.ObjectId,
  },
});
type Timelog = {
  desc: string;
  date: string;
  project: mongoose.Types.ObjectId;
  time: string;
  uid: mongoose.Types.ObjectId;
};

export interface ITimelog extends mongoose.Document, Timelog {}
