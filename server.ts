// server.ts
import app from "./src/app";

const PORT = process.env.PORT || 3000;

// Hanya jalankan listen kalau bukan di environment Vercel
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log("🚀 ========================================");
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("🚀 ========================================");
    console.log("");
    console.log("📍 Available routes:");
    console.log("   GET  /              → Health check");
    console.log("   GET  /api/todos     → Get all todos");
    console.log("   POST /api/todos     → Create todo");
    console.log("   GET  /api/test-db   → Test Supabase connection");
    console.log("");
  });
}

export default app;
