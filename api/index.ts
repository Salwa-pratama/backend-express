// api/index.ts
import app from "../src/app";
import serverless from "serverless-http";

console.log("🚀 Initializing Vercel serverless function...");

// ✅ GUNAKAN DEFAULT EXPORT, BUKAN NAMED EXPORT!
export default serverless(app);

console.log("✅ Serverless function ready!");
