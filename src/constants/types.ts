export type idType = `${string}-${string}-${string}-${string}-${string}`;

export type UserDataModel = {
  username: string;
  age: number;
  hobbies: [];
  id: idType;
};

export type userDataRequestType = Omit<UserDataModel, 'id'>;

export type userDataResponseType = UserDataModel;
