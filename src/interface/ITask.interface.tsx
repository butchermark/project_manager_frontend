import { IUser } from "./IUser.interface";
import { IProject } from "./IProject.interface";

export interface ITask {
  id?: string;
  name?: string;
  description?: string;
  status?: string;
  archived?: boolean;
  user?: IUser;
  project?: IProject;
}
