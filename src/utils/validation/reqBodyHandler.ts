import {
  userDataRequestType,
} from '../../constants/types';

import { IncomingMessage } from 'node:http';
import { reqBodyValidation } from './reqBodyValidation';

export const reqBodyHandler = async (req: IncomingMessage) => {
  return new Promise<userDataRequestType>(async (resolve, reject) => {
    const rowBody: Uint8Array[] = [];

    req.on('data', (data) => {
      rowBody.push(data);
    });

    req.on('end', () => {
      if (!rowBody.length) {
        reject(
          'There are 3 required fields: "username": string,"age": string, "hobbies": [] | string[]',
        );
      }

      try {
        const userDataToValidate = JSON.parse(
          Buffer.concat(rowBody).toString(),
        );
        const validationResult = reqBodyValidation(userDataToValidate);

        if (validationResult.isValid) {
          resolve(validationResult.body as userDataRequestType);
        } else {
          reject(validationResult.body);
        }
      } catch (e) {
        reject('Check fields in body');
      }
    });
  });
};
