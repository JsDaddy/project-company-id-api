import { Schema, Document, Types } from 'mongoose';

export const projectSchema: Schema = new Schema(
  {
    name: {
      required: true,
      type: String,
      unique: true,
    },
    startDate: {
      required: true,
      type: Date,
    },
    endDate: {
      required: false,
      type: Date,
    },
    industry: {
      required: true,
      type: String,
    },
    customer: {
      required: true,
      type: String,
    },
    stack: {
      required: true,
      type: [Types.ObjectId],
    },
    isInternal: {
      required: true,
      type: Boolean,
    },
    isRejected: {
      required: true,
      type: Boolean,
    },
  },
  {
    versionKey: false,
  },
);

export type Project = {
  name: string;
  industry: string;
  customer: string;
  startDate: Date;
  isActivity: boolean;
  stack: Types.ObjectId[];
  isInternal: boolean;
  isRejected: boolean;
};

export interface IProject extends Document, Project {}
