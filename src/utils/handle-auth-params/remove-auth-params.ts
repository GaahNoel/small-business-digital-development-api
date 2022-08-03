export const removeAuthParams = (data: any) => {
  const { authAccountId, ...dataWithoutAuth } = data;

  return dataWithoutAuth;
};
