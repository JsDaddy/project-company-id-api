import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

export const facilitiesSchema: mongoose.Schema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
    },
    image: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
      unique: true,
    },
    text: {
      required: true,
      type: String,
    },
    description_title: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    feedbacks: {
      required: false,
      type: [Types.ObjectId],
    },
    stack: {
      required: false,
      type: [Types.ObjectId],
    },
  },
  {
    versionKey: false,
  },
);
