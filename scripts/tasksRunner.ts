import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { HttpService } from '@nestjs/common';

const promisedReadDir: Function = util.promisify(fs.readdir);

readTasks();

async function readTasks(): Promise<void> {
  let delays: number[] = [];
  try {
    const tasksFileList: string[] = await promisedReadDir(
      path.resolve(__dirname, 'tasks'),
    );

    for (const tasksFile of tasksFileList) {
      const getTask: Promise<ITask | null> = await import(
        path.resolve(__dirname, 'tasks', tasksFile)
        // tslint:disable-next-line:no-any
      ).then((m: any) => m.task());
      const task: ITask | null = await getTask;
      if (!task) {
        continue;
      }
      if (task.delay) {
        delays.push(task.delay);
      }
      setTimeout(() => sentToSlack(task), task.delay);
    }
    const delay: number = Math.max(...delays);
    setTimeout(() => process.exit(-1), delay + 60000);
  } catch (e) {
    console.log(e);
  }
}

async function sentToSlack({ ids, message }: ITask): Promise<void> {
  if (!process.env.BOT_TOKEN) {
    return;
  }
  const http: HttpService = new HttpService();
  for (const id of ids) {
    await http
      .post(
        'https://slack.com/api/chat.postMessage',
        { channel: id, text: `>>>${message}` },
        {
          responseType: 'json',
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${process.env.BOT_TOKEN}`,
          },
        },
      )
      .toPromise();
  }
}

export interface ITask {
  ids: string[];
  message: string;
  delay?: number;
}
