import { IFacilities } from '../interfaces/facilities.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
@Injectable()
export class FacilitiesService {
  public constructor(
    @InjectModel('facilities')
    private readonly facilitiesModel: Model<IFacilities & Document>,
  ) {}

  // public async findFacility(facility: string): Promise<IFacilities | null> {
  //   return await this.facilitiesModel.findOne({ name: facility });
  // }
  public async findFacility(facility: string): Promise<IFacilities | null> {
    // tslint:disable-next-line:no-any
    const service: IFacilities[] = await this.facilitiesModel.aggregate([
      { $match: { name: facility } },
      {
        $lookup: {
          from: 'stacks',
          localField: 'stack',
          as: 'stack',
          foreignField: '_id',
        },
      },
      {
        $lookup: {
          from: 'feedbacks',
          localField: 'feedback',
          as: 'feedback',
          foreignField: '_id',
        },
      },
      {
        $unwind: '$feedback',
      },
    ]);
    return service[0];
    // return await this.facilitiesModel.findOne({ name: facility });
  }
}
