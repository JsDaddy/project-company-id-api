import * as mongoose from 'mongoose';

export const userSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      required: false,
      type: String,
    },
    secondName: {
      required: false,
      type: String,
    },
    avatar: {
      required: false,
      type: String,
    },
    initialLogin: {
      required: true,
      type: Boolean,
    },
    dob: {
      required: false,
      type: Date,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: false,
    },
    englishLevel: {
      required: false,
      type: String,
    },
    github: {
      required: false,
      type: String,
      unique: true,
    },
    phone: {
      required: false,
      type: String,
      unique: true,
    },
    position: {
      required: false,
      type: String,
    },
    role: {
      required: false,
      type: String,
    },
    skype: {
      required: false,
      type: String,
      unique: true,
    },
    activeProjects: {
      required: false,
      type: Array,
    },
  },
  // {
  //   versionKey: false,
  // },
);

export type User = {
  email: string;
  name?: string;
  secondName?: string;
  role?: string;
  dob?: Date;
  englishLevel?: string;
  password: string;
  github?: string;
  initialLogin: boolean;
  accessToken?: string;
  position?: string;
  avatar?: string;
  phone?: string;
  skype?: string;
  activeProjects?: string[];
};

export interface IUser extends mongoose.Document, User {}
