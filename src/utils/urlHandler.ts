import { IncomingMessage } from 'node:http';
import { idType } from '../constants/types';

export const urlHandler = (
  req: IncomingMessage,
): Array<idType | string> | [] => {
  if (!req.url) return [];

  const allParamsFromUrl = req.url?.split('/').filter((param) => param !== '');
  const hasPathParams = allParamsFromUrl?.length && allParamsFromUrl.length > 1;

  if (hasPathParams) {
    return allParamsFromUrl?.slice(1);
  } else {
    return [];
  }
};
