import { ServerResponse } from 'node:http';
import { StatusCodeEnum } from '../constants/enum';

export const responseHandler = (
  res: ServerResponse,
  statusCode: StatusCodeEnum,
  message: string,
): void => {
  res.statusCode = statusCode;
  res.write(message);
  res.end();
};
