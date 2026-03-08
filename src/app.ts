import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/login/login_router";

console.log("🚀 Initializing Express app...");

const app = express();

console.log("✅ Express app created");

// Error handling middleware - MUST be first
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`📍 Incoming request: ${req.method} ${req.path}`);
  next();
});

// Middleware
try {
  console.log("🔄 Setting up middleware...");
  app.use(cors());
  app.use(express.json());
  console.log("✅ Middleware configured");
} catch (error: any) {
  console.error("❌ Error setting up middleware:", error.message);
}

// Health Check
app.get("/", (req: Request, res: Response) => {
  console.log("✅ Health check endpoint hit");
  res.json({
    status: "ok",
    message: "API is running on Vercel! 🚀",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRouter);
console.log("✅ Express app initialization complete!");

export default app;
