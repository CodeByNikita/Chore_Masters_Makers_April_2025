export interface ParentType {
  _id: string;
  username: string;
  password: string;
  usersChildren: ChildType[];
  tasks: TaskType[];
  profilePic: string;
  prizes: PrizeType[];
}
export interface TaskType {
  _id: string;
  name: string;
  value: number;
  imageURL: string;
}

export interface TaskId {
  _id: string;
}

export interface TaskImages {
  taskId: string;
  picBefore: string;
  picAfter: string;
}

export interface ChildType {
  _id: string;
  username: string;
  password: string;
  prize: PrizeType;
  tasksCompleted: TaskType[];
  tasksNotCompleted: TaskType[];
  points: number;
  imageURL: string;
  taskImages?: TaskImages[];
}

export interface PrizeType {
  _id: string;
  name: string;
  value: string;
  imageURL: string;
}

export interface TokenResponse {
  token: string;
  userType: string;
}

export interface ChildData {
  name: string;
  password: string;
  profilePic: any; // Temp fix. File | null | string was giving errors
  selectedTasks: TaskType[];
  selectedPrize: PrizeType | null;
}

export interface TaskInputData {
  name: string;
  value: number;
  imageURL: File | null;
}

export interface TaskPayload {
  _id?: string;
  name: string;
  value: number;
  imageURL: string | null;
}

export interface PrizeInputData {
  name: string;
  value: number;
  image: File | null;
}

export interface PrizePayload {
  name: string;
  value: number;
  image: string | null;
}
