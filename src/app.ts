import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { supabase } from "./db/supabase";

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // Bisa diganti dengan domain spesifik nanti
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// 🛡️ Middleware: Pastikan semua response punya Content-Type JSON
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// 🏥 Health Check - GUNAKAN res.json(), BUKAN res.send()
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "API is running on Vercel! 🚀",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Route: Get Todos
app.get("/api/todos", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("todos").select("*");

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching todos:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

// ✅ Route: Create Todo
app.post("/api/todos", async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const { data, error } = await supabase
      .from("todos")
      .insert([{ title }])
      .select();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error: any) {
    console.error("Error creating todo:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

// 🔄 Handle 404 - Biar gak return HTML default Express
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// 🐛 Error Handler Global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

export default app;
