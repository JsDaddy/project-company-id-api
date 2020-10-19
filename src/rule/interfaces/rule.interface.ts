import { Types } from 'mongoose';

export interface IRule {
  _id?: Types.ObjectId;
  title: string;
  desc: string;
}
