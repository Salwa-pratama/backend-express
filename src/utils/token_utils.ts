import jwt from "jsonwebtoken";

export function generateTokens(userId: number, email: string, role: string) {
  const payload = { userId, email, role };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_ACCESS_EXPIRY ?? "15m") as any,
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRY ?? "7d") as any,
  });

  return { accessToken, refreshToken };
}
