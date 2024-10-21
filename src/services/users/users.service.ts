import { IncomingMessage, ServerResponse } from 'node:http';
import { idType } from '../../constants/types';
import { UsersDB } from '../../db/users.db';
import { responseHandler } from '../../utils/responseHandler';
import { StatusCodeEnum } from '../../constants/enum';
import { reqUserIdHandler } from '../../utils/validation/reqUserIdHandler';
import { dbResponseHandler } from '../../utils/dbResponseHandler';
import { reqBodyHandler } from '../../utils/validation/reqBodyHandler';

const usersDB = UsersDB.getInstance();

export const getAllUsers = async (res: ServerResponse) => {
  const allUsers = usersDB.getAllUsers();
  responseHandler(res, StatusCodeEnum.OK, JSON.stringify(allUsers));
};

export const getUser = async (
  res: ServerResponse,
  userId: idType | string | undefined,
) => {
  const isUserIdValid = reqUserIdHandler(userId, res);
  if (!isUserIdValid) return;

  const userData = usersDB.getUserById(userId as idType);

  dbResponseHandler(userData, res);
};

export const createUser = async (
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> => {
  try {
    const checkUserData = await reqBodyHandler(req);
    const userData = usersDB.createUser(checkUserData);

    dbResponseHandler(userData, res, false, StatusCodeEnum.CREATED);
  } catch (e) {
    const message = e as string;
    responseHandler(res, StatusCodeEnum.BAD_REQUEST, message);
  }
};

export const updateUser = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: idType | string | undefined,
) => {
  try {
    const isUserIdValid = reqUserIdHandler(userId, res);
    if (!isUserIdValid) return;

    const checkUserData = await reqBodyHandler(req);
    const userData = usersDB.changeUserById(userId as idType, checkUserData);

    dbResponseHandler(userData, res);
  } catch (e) {
    const message = e as string;
    responseHandler(res, StatusCodeEnum.BAD_REQUEST, message);
  }
};

export const deleteUser = async (
  res: ServerResponse,
  userId: idType | string | undefined,
) => {
  const isUserIdValid = reqUserIdHandler(userId, res);
  if (!isUserIdValid) return;

  const userData = usersDB.deleteUserById(userId as idType);

  dbResponseHandler(userData, res, !!userData);
};
