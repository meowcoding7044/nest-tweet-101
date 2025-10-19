import { ProfileModel } from "../profile/profile.model";

export class UserModel {
  id?: number;
  email!: string;
  username!: string;
  password!: string;
  profile?: ProfileModel;
  createdAt?: Date;
  updatedAt?: Date;
  tokens?:string
}
