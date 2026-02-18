import app from "../src/app";
import serverless from "serverless-http";

console.log("🚀 Loading serverless handler...");

// Wrap Express app dengan serverless-http
console.log("🔄 Wrapping Express app with serverless-http...");

// Export harus di top-level, gak bisa di dalam try-catch!
export const handler = serverless(app);

console.log("✅ Handler created successfully!");
