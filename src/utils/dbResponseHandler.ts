import { responseHandler } from './responseHandler';
import { StatusCodeEnum } from '../constants/enum';
import { userDataResponseType } from '../constants/types';
import { ServerResponse } from 'node:http';

export const dbResponseHandler = (
  userData: userDataResponseType | null | boolean,
  res: ServerResponse,
  isDeleted = false,
  statusCode?: StatusCodeEnum,
) => {
  if (isDeleted) {
    responseHandler(
      res,
      StatusCodeEnum.BAD_REQUEST,
      'User was successfully deleted',
    );
    return;
  }

  if (!userData) {
    responseHandler(
      res,
      StatusCodeEnum.BAD_REQUEST,
      'There is no user with such id',
    );
  } else {
    responseHandler(
      res,
      statusCode ?? StatusCodeEnum.OK,
      JSON.stringify(userData),
    );
  }
};
