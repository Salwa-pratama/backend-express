import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./login_repository";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserResponse,
} from "./login_dto";
import {
  ServiceResponse,
  ServiceResponseSchema,
} from "@/common/models/ServiceResponse";

export class AuthService {
  constructor(
    private readonly repository: AuthRepository = new AuthRepository(),
  ) {}

  // ===== Private Helpers =====

  private sanitizeUser(user: any): UserResponse {
    const { passwordHash, refreshTokenHash, ...publicUser } = user;
    return publicUser;
  }

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  private verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  private generateTokens(userId: number, email: string, role: string) {
    const payload = { userId, email, role };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: (process.env.JWT_ACCESS_EXPIRY ?? "15m") as any,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: (process.env.JWT_REFRESH_EXPIRY ?? "7d") as any,
    });

    return { accessToken, refreshToken };
  }

  // ===== Public Methods =====

  async registerAsync(
    payload: RegisterRequest,
  ): Promise<ServiceResponseSchema<UserResponse | null>> {
    try {
      const existing = await this.repository.findByEmailAsync(payload.email);
      if (existing) {
        return ServiceResponse.success(
          "Email already in use",
          null,
          StatusCodes.BAD_REQUEST,
        );
      }

      const newUser = await this.repository.createUserAsync({
        email: payload.email,
        name: payload.name,
        passwordHash: this.hashPassword(payload.password),
        role: "USER",
        refreshTokenHash: null,
      });

      return ServiceResponse.success(
        "User registered successfully",
        this.sanitizeUser(newUser),
        StatusCodes.CREATED,
      );
    } catch (error) {
      return ServiceResponse.failure(
        "An error occurred while registering.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginAsync(
    payload: LoginRequest,
  ): Promise<ServiceResponseSchema<LoginResponse | null>> {
    try {
      const user = await this.repository.findByEmailAsync(payload.email);
      if (!user || !this.verifyPassword(payload.password, user.passwordHash)) {
        return ServiceResponse.failure(
          "Invalid email or password",
          null,
          StatusCodes.UNAUTHORIZED,
        );
      }

      const { accessToken, refreshToken } = this.generateTokens(
        user.id,
        user.email,
        user.role,
      );

      await this.repository.updateRefreshTokenAsync(
        user.id,
        this.hashPassword(refreshToken),
      );

      return ServiceResponse.success("Login successful", {
        user: this.sanitizeUser(user),
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return ServiceResponse.failure(
        "An error occurred while logging in.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logoutAsync(userId: number): Promise<ServiceResponseSchema<null>> {
    try {
      await this.repository.clearRefreshTokenAsync(userId);
      return ServiceResponse.success("Logout successful", null);
    } catch (error) {
      return ServiceResponse.failure(
        "An error occurred while logging out.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
