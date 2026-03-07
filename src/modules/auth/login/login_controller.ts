import type { Request, Response } from "express";
import { AuthService } from "./login_service";
import type { LoginRequest, RegisterRequest } from "./login_dto";

export class AuthController {
  constructor(private readonly service: AuthService = new AuthService()) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const payload = req.body as RegisterRequest;
    const result = await this.service.registerAsync(payload);
    res.status(result.statusCode).json(result);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const payload = req.body as LoginRequest;
    const result = await this.service.loginAsync(payload);
    res.status(result.statusCode).json(result);
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    const result = await this.service.logoutAsync(userId);
    res.status(result.statusCode).json(result);
  };
}
