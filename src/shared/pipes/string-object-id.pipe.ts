import { Types } from 'mongoose';
import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseObjectIdPipe
  implements PipeTransform<string, Types.ObjectId> {
  public transform(value: string): Types.ObjectId {
    const objectId: Types.ObjectId = Types.ObjectId(value);
    return objectId;
  }
}
