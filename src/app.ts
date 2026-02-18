import express, { Request, Response } from "express";
import cors from "cors";
import { supabase } from "./db/supabase";

const app = express();

// Middleware
app.use(cors()); // Izinkan request dari domain lain
app.use(express.json());

// Contoh Route: Get Todos
app.get("/api/todos", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("todos").select("*");

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Contoh Route: Create Todo
app.post("/api/todos", async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ title }])
      .select();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.send("API is running on Vercel! 🚀");
});

export default app;
