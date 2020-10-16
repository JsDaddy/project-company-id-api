import { Types } from 'mongoose';

export interface IFilterProjects {
  'users._id'?: Types.ObjectId;
  isActivity?: boolean;
  isInternal?: boolean;
  stack?: Types.ObjectId;
}
export interface IFilterProject {
  _id?: Types.ObjectId;
}
