import * as mongoose from 'mongoose';

export const userSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    secondName: {
      required: true,
      type: String,
    },
    avatar: {
      required: true,
      type: String,
    },
    initialLogin: {
      required: true,
      type: Boolean,
    },
    dob: {
      required: true,
      type: Date,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    englishLevel: {
      required: true,
      type: String,
    },
    github: {
      required: true,
      type: String,
      unique: true,
    },
    phone: {
      required: true,
      type: String,
      unique: true,
    },
    position: {
      required: true,
      type: String,
    },
    role: {
      required: true,
      type: String,
    },
    skype: {
      required: true,
      type: String,
      unique: true,
    },
    activeProjects: {
      required: true,
      type: Array,
    },
  },
  {
    versionKey: false,
  },
);
