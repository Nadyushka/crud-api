import { v4 as uuidv4 } from 'uuid';
import {
  idType,
  UserDataModel,
  userDataRequestType,
  userDataResponseType,
} from '../constants/types';

export class UsersDB {
  public static instance: UsersDB;
  private usersData: UserDataModel[] | [] = [];

  public static getInstance() {
    if (!UsersDB.instance) {
      UsersDB.instance = new UsersDB();
    }
    return UsersDB.instance;
  }

  getAllUsers(): userDataResponseType[] {
    return this.usersData;
  }

  getUserById(userId: idType): null | userDataResponseType {
    const user = this.usersData.find((user) => user.id === userId);
    if (!user) return null;

    return user;
  }

  createUser(userData: userDataRequestType): userDataResponseType {
    const newUserData: UserDataModel = {
      ...userData,
      id: uuidv4() as idType,
    };
    (this.usersData as UserDataModel[]).push(newUserData);

    return newUserData;
  }

  changeUserById(
    userId: idType,
    userData: userDataRequestType,
  ): null | userDataResponseType {
    const userIndex = this.usersData.findIndex((user) => user.id === userId);

    if (userIndex < 0) return null;

    const updatedUserData = { ...userData, id: userId };
    this.usersData[userIndex] = updatedUserData;
    return updatedUserData;
  }

  deleteUserById(userId: idType): null | boolean {
    const userIndex = this.usersData.findIndex((user) => user.id === userId);
    if (userIndex < 0) return null;

    this.usersData.splice(userIndex, 1);
    return true;
  }
}
