import { Types } from 'mongoose';

export interface IFacilities {
  image: string;
  name: string;
  title: string;
  text: string;
  content_title: string;
  content: string;
  feedbacks: Types.ObjectId[];
}
