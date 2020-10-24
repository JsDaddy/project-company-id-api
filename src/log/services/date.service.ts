import { Injectable } from '@nestjs/common';
import moment from 'moment';

@Injectable()
export class DateService {
  public getWeekDays(date: Date): number {
    let day: number = 1;
    let counter: number = 0;
    let newDate: Date = date;
    const year: number = newDate.getFullYear();
    const month: number = newDate.getMonth();

    while (newDate.getMonth() === month) {
      if (newDate.getDay() === 0 || newDate.getDay() === 6) {
        counter += 1;
      }
      day += 1;
      newDate = new Date(year, month, day);
    }
    return counter;
  }
  public timeToString(time: number): string {
    return `${Math.floor(time)}h ${Math.floor(
      (time - Math.floor(time)) * 60,
    )}m`;
  }
  public checkIfWeekDays(date: Date): boolean {
    return date.getDay() === 0 || date.getDay() === 6;
  }
  public hoursInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() * 8;
  }

  public getLastDate(date: Date): Date {
    return new Date(
      moment(date)
        .startOf('day')
        .add(1, 'day')
        .startOf('day')
        .subtract(1, 'millisecond')
        .endOf('month')
        .format(),
    );
  }
  public getNextDay(date: string): Date {
    return new Date(new Date(date).setDate(new Date(date).getDate() + 1));
  }
  public sumTimeInMinutes(times: any[]): number {
    let h: number = 0;
    let m: number = 0;
    const reg1: RegExp = /\d+(?=h)/;
    const reg2: RegExp = /\d+(?=m)/;
    for (const time of times) {
      h += parseInt(time.match(reg1)) || 0;
      m += parseInt(time.match(reg2)) || 0;
    }
    return h * 60 + m;
  }
}
