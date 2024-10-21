import { IncomingMessage, ServerResponse } from 'node:http';
import { StatusCodeEnum } from '../constants/enum';
import { responseHandler } from '../utils/responseHandler';

import { urlHandler } from '../utils/urlHandler';
import { userController } from '../controllers/users/users.controller';

export const routesHandlers = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const urlParams = urlHandler(req);

  switch (urlParams[0]) {
    case 'users': {
      await userController(req, res, urlParams.slice(1));
      break;
    }
    default: {
      responseHandler(res, StatusCodeEnum.NOT_FOUND, 'There is no such url');
    }
  }
};
