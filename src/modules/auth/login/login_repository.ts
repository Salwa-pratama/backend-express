import { prisma } from "@/common/lib/prisma";
import type { UserResponse } from "./login_dto";

type UserWithSecrets = UserResponse & {
  passwordHash: string;
  refreshTokenHash: string | null;
};

type CreateUserPayload = Omit<
  UserWithSecrets,
  "id" | "createdAt" | "updatedAt"
>;

export class AuthRepository {
  async findByEmailAsync(email: string): Promise<UserWithSecrets | null> {
    return prisma.userPublic.findUnique({ where: { email } }) ?? null;
  }

  async findByIdAsync(id: number): Promise<UserWithSecrets | null> {
    return prisma.userPublic.findUnique({ where: { id } }) ?? null;
  }

  async createUserAsync(payload: CreateUserPayload): Promise<UserWithSecrets> {
    return prisma.userPublic.create({
      data: { ...payload, updatedAt: new Date() },
    });
  }

  async updateRefreshTokenAsync(userId: number, hash: string): Promise<void> {
    await prisma.userPublic.update({
      where: { id: userId },
      data: { refreshTokenHash: hash, updatedAt: new Date() },
    });
  }

  async clearRefreshTokenAsync(userId: number): Promise<void> {
    await prisma.userPublic.update({
      where: { id: userId },
      data: { refreshTokenHash: null, updatedAt: new Date() },
    });
  }
}
