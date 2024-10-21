import { idType } from '../../constants/types';
import { ServerResponse } from 'node:http';
import { responseHandler } from '../responseHandler';
import { StatusCodeEnum } from '../../constants/enum';
import { userIdValidation } from './userIdValidation';

export const reqUserIdHandler = (
  userId: string | undefined | idType,
  res: ServerResponse,
): boolean => {
  if (!userId) {
    responseHandler(
      res,
      StatusCodeEnum.BAD_REQUEST,
      'Id must be provided to get user data',
    );
    return false;
  }

  const isUserIdValidFormat = userIdValidation(userId);
  if (isUserIdValidFormat) {
    return true;
  } else {
    responseHandler(res, StatusCodeEnum.BAD_REQUEST, 'Wrong id type');
    return false;
  }
};
