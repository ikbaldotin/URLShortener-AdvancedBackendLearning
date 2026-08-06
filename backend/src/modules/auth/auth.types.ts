export type registerUserType = {
  name: string;
  email: string;
  passwordHash: string;
};
export type UserResponseType = {
  name: string;
  id: string;
  email: string;

  createdAt: Date;
  updatedAt: Date;
};
export type JwtPayloadType = {
  userId: string;
};
