import * as mongoose from 'mongoose';

export const feedbacksSchema: mongoose.Schema = new mongoose.Schema(
  {
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
    position: {
      required: true,
      type: String,
    },
    linkedin: {
      required: true,
      type: String,
    },
  },
  {
    versionKey: false,
  },
);
