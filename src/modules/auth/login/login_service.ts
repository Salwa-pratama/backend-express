import { StatusCodes } from "http-status-codes";
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
} from "@/common/models/service_response";
import {
  hashPassword,
  sanitizeUser,
  verifyPassword,
} from "@/utils/password_util";
import { generateTokens } from "@/utils/token_utils";

export class AuthService {
  constructor(
    private readonly repository: AuthRepository = new AuthRepository(),
  ) {}

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
        passwordHash: hashPassword(payload.password),
        role: "USER",
        refreshTokenHash: null,
      });

      return ServiceResponse.success(
        "User registered successfully",
        sanitizeUser(newUser),
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
      if (!user || !verifyPassword(payload.password, user.passwordHash)) {
        return ServiceResponse.failure(
          "Invalid email or password",
          null,
          StatusCodes.UNAUTHORIZED,
        );
      }

      const { accessToken, refreshToken } = generateTokens(
        user.id,
        user.email,
        user.role,
      );

      await this.repository.updateRefreshTokenAsync(
        user.id,
        hashPassword(refreshToken),
      );

      return ServiceResponse.success("Login successful", {
        user: sanitizeUser(user),
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.log("error : ", error);
      return ServiceResponse.failure(
        `An error occurred while logging in. Error : ${error}`,
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
