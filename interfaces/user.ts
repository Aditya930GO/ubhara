// import { UserRoleAction } from "./user-role";

export interface User {
  _id: string;
  name: string;
  username: string;
  role: string;
  email: string;
  phone?: string;
  image_url?: string;
  birth_date: Date;
  create_date: Date;
  status: "active" | "inactive";
  class_id?: string;
}

export interface UserMin {
  _id: string;
  classId: string;
}

export interface UserOverview {
  _id: string;
  name: string;
  image_url: string;
  role: string;
  sale: {
    count: number;
    value: number;
  };
}

export interface UserRequest {
  _id?: string;
  role?: string;
  name: string;
  email: string;
  password: string;
  old_password?: string;
  birth_date?: number;
  file?: File;
  phone?: string;
}
