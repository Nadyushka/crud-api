import { userDataRequestType } from '../../constants/types';

export const reqBodyValidation = (
  userData: Record<string, unknown>,
): reqBodyValidationReturnType => {
  if (
    !userData.hasOwnProperty('username') ||
    !userData.hasOwnProperty('age') ||
    !userData.hasOwnProperty('hobbies')
  ) {
    return {
      isValid: false,
      body: 'There are 3 required fields: "username": string,"age": string, "hobbies": [] | string[]',
    };
  }

  const { id, username, age, hobbies } = userData;

  if (id) {
    return {
      isValid: false,
      body: 'Field "id" must not be sent',
    };
  }

  if (
    typeof username !== 'string' ||
    typeof age !== 'number' ||
    !Array.isArray(hobbies)
  ) {
    return {
      isValid: false,
      body: 'There are 3 required fields: "username" - string,"age" - string, "hobbies" - [] | string[]',
    };
  }

  if (username.length < 1 || age < 1) {
    return {
      isValid: false,
      body: '"username" should be minimum 3 symbols, "age" should be more than 1',
    };
  }

  return {
    isValid: true,
    body: userData as userDataRequestType,
  };
};

type reqBodyValidationReturnType = {
  isValid: boolean;
  body: string | userDataRequestType;
};
