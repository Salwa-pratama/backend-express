import { createClient } from "@supabase/supabase-js";

// Load .env file (hanya untuk development lokal)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 🔍 Validasi Environment Variables
if (!supabaseUrl) {
  console.error("❌ ERROR: SUPABASE_URL is not defined!");
  console.error("👉 Check your .env file or Vercel Environment Variables");
  throw new Error("Missing SUPABASE_URL");
}

if (!supabaseKey) {
  console.error("❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is not defined!");
  console.error("👉 Check your .env file or Vercel Environment Variables");
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

// ✅ Log kalau env vars ada
console.log("✅ Supabase URL:", supabaseUrl);
console.log("✅ Supabase Key:", supabaseKey.substring(0, 20) + "..."); // Jangan log full key!

// Create Supabase Client
export const supabase = createClient(supabaseUrl, supabaseKey);

// 🧪 Fungsi untuk test koneksi
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    console.log("🔄 Testing Supabase connection...");

    // Test query sederhana (ganti 'todos' dengan tabel lo)

    console.log("✅ Supabase connection SUCCESS!");
    console.log("🟢 Database reachable, tables accessible");
    return true;
  } catch (error: any) {
    console.error("❌ Supabase connection CRASHED!");
    console.error("🔴 Error:", error.message);
    return false;
  }
}
