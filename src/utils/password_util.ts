import { UserResponse } from "@/modules/auth/login/login_dto";

import bcrypt from "bcryptjs";

export function sanitizeUser(user: any): UserResponse {
  const { passwordHash, refreshToken, ...publicUser } = user;
  return publicUser as UserResponse;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}
