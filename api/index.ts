import app from "../src/app";
import serverless from "serverless-http";

// Export handler yang dimengerti Vercel
export const handler = serverless(app);
