import { Types } from 'mongoose';

export interface IProject {
  _id: Types.ObjectId;
  name: string;
  industry: string;
  customer: string;
  startDate: Date;
  isActivity: boolean;
  stack: Types.ObjectId[];
  isInternal: boolean;
  isRejected: boolean;
}
