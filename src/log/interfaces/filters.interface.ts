import { Types } from 'mongoose';

export interface IFilterLog {
  project: Types.ObjectId;
  type: number;
  uid: Types.ObjectId;
}
