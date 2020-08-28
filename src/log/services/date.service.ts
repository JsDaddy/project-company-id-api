import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  public getWeekDays(date: Date): number {
    let day = 1;
    let counter = 0;
    let newDate = date;
    const year = newDate.getFullYear();
    const month = newDate.getMonth();

    while (newDate.getMonth() === month) {
      if (newDate.getDay() === 0 || newDate.getDay() === 6) {
        counter += 1;
      }
      day += 1;
      newDate = new Date(year, month, day);
    }
    return counter;
  }
  public timeDobuleToString(time: number): string {
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
  public sumTimeInMinutes(times: any[]): number {
    let h = 0;
    let m = 0;
    const reg1 = /\d+(?=h)/;
    const reg2 = /\d+(?=m)/;
    for (const time of times) {
      h += parseInt(time.match(reg1)) || 0;
      m += parseInt(time.match(reg2)) || 0;
    }
    return h * 60 + m;
  }
}
