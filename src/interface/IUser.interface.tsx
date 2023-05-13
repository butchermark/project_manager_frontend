import { ITask } from "./ITask.interface";

export interface IUser {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
  tasks?: ITask[];
}
