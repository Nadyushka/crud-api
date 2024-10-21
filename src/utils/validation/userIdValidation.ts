export const userIdValidation = (userId: string) => {
  const regex = /^[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+$/;
  return regex.test(userId);
};
