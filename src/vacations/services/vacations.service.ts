import { Positions } from './../../auth/enums/positions.enum';
import { SlackService } from './../../shared/services/slack.service';
import { CreateVacationDto, VacationType } from './../dto/create-vacation.dto';
import { IVacation } from 'src/vacations/interfaces/vacation.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ChangeStatusDto, StatusType } from '../dto/change-status.dto';
import moment from 'moment';
import { IUser } from 'src/auth/interfaces/user.interface';

@Injectable()
export class VacationsService {
  public constructor(
    @InjectModel('vacations')
    private readonly _vacationModel: Model<IVacation & Document>,
    @InjectModel('users')
    private readonly _usersModel: Model<IUser & Document>,
    private readonly _slackService: SlackService,
  ) {}

  public async createVacation(
    createVacationDto: CreateVacationDto & { uid: Types.ObjectId },
  ): Promise<IVacation> {
    // tslint:disable-next-line:no-any
    const user: IUser | null = await this._usersModel.findOne({
      _id: createVacationDto.uid,
    });
    const owners: ISlack[] = await this._usersModel.aggregate([
      { $match: { position: Positions.OWNER } },
      {
        $project: {
          slack: 1,
        },
      },
    ]);

    const slackOwners: string[] = owners.map((item: ISlack) => item.slack);
    const type: number = parseInt(VacationType[createVacationDto.type]);
    const vacation: IVacation = await this._vacationModel.create({
      ...createVacationDto,
      status: StatusType.PENDING,
      type,
    });
    for (const slack of slackOwners) {
      if (user && slack && process.env.BOT_TOKEN) {
        this._slackService.sendMessage(
          slack,
          `${this.getEmoji(type)} You have request for ${this.getType(type)}\n
*From*: ${user.name} ${user.lastName}.\n
*Date*: ${createVacationDto.date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })}. \n
*Reason*: ${createVacationDto.desc}.`,
        );
      }
    }

    return vacation;
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

    return spentCount > maxCount - 1 ? 0 : maxCount - spentCount;
  }

  public async statusChange(
    _id: Types.ObjectId,
    changeStatusDto: ChangeStatusDto,
    owner: IUser,
  ): Promise<IVacation | null> {
    const { status } = changeStatusDto;

    const updatedVacation: IVacation | null = await this._vacationModel
      .findOneAndUpdate(
        { _id },
        { $set: { status: status.toLowerCase() } },
        { new: true },
      )
      .lean()
      .exec();
    const user: IUser | null = await this._usersModel.findOne({
      _id: updatedVacation?.uid,
    });
    const owners: IUser[] = await this._usersModel
      .find({ _id: { $ne: owner._id }, position: Positions.OWNER })
      .lean()
      .exec();
    const slackOwners: string[] = owners.map(
      (userOwner: IUser) => userOwner.slack,
    );
    const message: string = `${this.getEmojiFromType(
      status,
    )}Your request for ${this.getType(
      updatedVacation?.type,
    )} has been ${status.toLowerCase()}\n
*Date*: ${updatedVacation?.date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })}\n
*Approved by*: ${owner.name} ${owner.lastName}`;
    if (user && user.slack && process.env.BOT_TOKEN) {
      this._slackService.sendMessage(user.slack, message);
    }
    for (const slack of slackOwners) {
      if (slack && process.env.BOT_TOKEN) {
        this._slackService.sendMessage(
          slack,
          message.replace(
            'Your request',
            `Request from ${user?.name} ${user?.lastName}`,
          ),
        );
      }
    }
    return updatedVacation;
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
          'user.slack': 1,
        },
      },
    ]);
  }

  private getType(num: number = 0): string {
    const vacationTypes: string[] = [
      'vacation (non-paid)',
      'vacation (paid)',
      'sick (non-paid)',
      'sick (paid)',
    ];
    if (!vacationTypes[num]) {
      return vacationTypes[0];
    }
    return vacationTypes[num];
  }

  private getEmoji(num: number = 0): string {
    if (num < 2) {
      return ':beach_with_umbrella:';
    }
    return ':pill:';
  }

  private getEmojiFromType(type: StatusType = StatusType.APPROVED): string {
    if (type === StatusType.REJECTED) {
      return ':negative_squared_cross_mark:';
    }
    return ':white_check_mark:';
  }
}

interface ISlack {
  _id: Types.ObjectId;
  slack: string;
}
