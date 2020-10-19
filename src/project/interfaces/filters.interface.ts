import { Types } from 'mongoose';

export interface IFilterProjects {
  'users._id'?: Types.ObjectId;
  isActivity?: boolean;
  isInternal?: boolean;
  stack?: Types.ObjectId;
  endDate?: { $exists: boolean };
}
export interface IFilterProject {
  _id?: Types.ObjectId;
}
