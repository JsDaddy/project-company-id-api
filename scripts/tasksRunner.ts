import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { HttpService } from '@nestjs/common';

const promisedReadDir: Function = util.promisify(fs.readdir);

// setInterval(() => readTasks(), 10000);
readTasks();
async function readTasks(): Promise<void> {
  try {
    const tasksFileList: string[] = await promisedReadDir(
      path.resolve(__dirname, 'tasks'),
    );
    for (const tasksFile of tasksFileList) {
      const getTask: any = await import(
        path.resolve(__dirname, 'tasks', tasksFile)
      ).then((m) => m.task());
      const task = await getTask;
      if (!task) {
        continue;
      }

      setTimeout(() => sentToSlack(task), task.delay);
    }
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
