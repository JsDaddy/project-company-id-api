import { ITask } from '../tasksRunner';
// STATUS UPDATE
export async function task(): Promise<ITask | null> {
  return {
    ids: ['U0163ST93TJ'],
    message: ':calendar: Don`t forget to leave your status update',
    delay: 0,
  };
}
