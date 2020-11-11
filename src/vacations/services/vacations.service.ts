import { CreateVacationDto, VacationType } from './../dto/create-vacation.dto';
import { IVacation } from 'src/vacations/interfaces/vacation.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ChangeStatusDto, StatusType } from '../dto/change-status.dto';
import moment from 'moment';

@Injectable()
export class VacationsService {
  public constructor(
    @InjectModel('vacations')
    private readonly _vacationModel: Model<IVacation & Document>,
  ) {}

  public async createVacation(
    createVacationDto: CreateVacationDto & { uid: Types.ObjectId },
  ): Promise<IVacation> {
    const type: number = parseInt(VacationType[createVacationDto.type]);
    return await this._vacationModel.create({
      ...createVacationDto,
      status: StatusType.PENDING,
      type,
    });
  }

  public async availableCount(
    id: string,
    type: VacationType,
    maxCount: number = 18,
  ): Promise<number> {
    const now: Date = new Date();
    const end: Date = moment(now).endOf('year').toDate();
    const start: Date = moment(now).startOf('year').toDate();
    const spentCount: number = await this._vacationModel
      .find({
        status: StatusType.APPROVED,
        type,
        uid: Types.ObjectId(id),
        date: { $gte: start, $lt: end },
      })
      .count();
    console.log(spentCount + 'SPENT COUNT');
    console.log(start + 'start');
    console.log(end + 'end');
    console.log(now + 'now');
    console.log(type + 'type');

    return spentCount > maxCount - 1 ? 0 : maxCount - spentCount;
  }

  public async statusChange(
    _id: Types.ObjectId,
    changeStatusDto: ChangeStatusDto,
  ): Promise<IVacation | null> {
    const { status } = changeStatusDto;

    return await this._vacationModel
      .findOneAndUpdate(
        { _id },
        { $set: { status: status.toLowerCase() } },
        { new: true },
      )
      .lean()
      .exec();
  }

  // tslint:disable-next-line:no-any
  public async getVacations(): Promise<any[]> {
    return await this._vacationModel.aggregate([
      { $match: { status: StatusType.PENDING } },
      {
        $lookup: {
          as: 'user',
          foreignField: '_id',
          from: 'users',
          localField: 'uid',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          desc: 1,
          date: 1,
          type: 1,
          status: 1,
          'user.name': 1,
          'user.lastName': 1,
          'user.avatar': 1,
          'user._id': 1,
        },
      },
    ]);
  }
}
