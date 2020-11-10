import { StatusType } from './../../vacations/dto/change-status.dto';
import { Schema, Types } from 'mongoose';

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
    status: {
      required: true,
      type: StatusType,
    },
    isInternal: {
      required: true,
      type: Boolean,
    },
    isActivity: {
      required: true,
      type: Boolean,
    },
  },
  {
    versionKey: false,
  },
);
