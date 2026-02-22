import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

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

// Test Supabase route
app.get("/test-db", async (req: Request, res: Response) => {
  console.log("🔄 Testing Supabase connection...");
  try {
    const { supabase } = await import("./db/supabase");
    const { data, error } = await supabase.from("todos").select("*").limit(1);

    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(500).json({
        success: false,
        message: "Supabase error",
        error: error.message,
      });
    }

    console.log("✅ Supabase connection successful!");
    res.json({ success: true, message: "Supabase connected!", data });
  } catch (error: any) {
    console.error("❌ Test DB error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ... route lainnya (todos, dll)

// Global error handler - MUST be last
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("💥 UNHANDLED ERROR:", err);
  console.error("💥 Stack:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

console.log("✅ Express app initialization complete!");

export default app;
