import { IUser } from "./IUser.interface";

import { ITask } from "./ITask.interface";

export interface IProject {
  id?: string;
  name?: string;
  description?: string;
  status?: string;
  users?: IUser[];
  tasks?: ITask[];
  manager?: IUser;
}
