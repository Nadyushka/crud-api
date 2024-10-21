import { IncomingMessage, ServerResponse } from 'node:http';
import { responseHandler } from '../../utils/responseHandler';
import { MethodEnum, StatusCodeEnum } from '../../constants/enum';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "../../services/users/users.service";
import { idType } from "../../constants/types";

export const userController = async (
  req: IncomingMessage,
  res: ServerResponse,
  reqUrlParams: Array<idType | string | undefined>,
): Promise<void> => {
  switch (req.method) {
    case MethodEnum.GET: {
      if (!reqUrlParams.length) {
        await getAllUsers(res);
      } else {
        await getUser(res, reqUrlParams[0]);
      }
      break;
    }
    case MethodEnum.POST: {
      await createUser(req, res);
      break;
    }
    case MethodEnum.PUT: {
      await updateUser(req, res, reqUrlParams[0]);
      break;
    }
    case MethodEnum.DELETE: {
      await deleteUser(res, reqUrlParams[0]);
      break;
    }
    default: {
      responseHandler(
        res,
        StatusCodeEnum.BAD_REQUEST,
        'There is no such method.Check your request',
      );
    }
  }
};
