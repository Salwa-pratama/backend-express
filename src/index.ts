import app from "./app";
import { testSupabaseConnection } from "./database/supabase";
const PORT = process.env.APP_PORT || 1915;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Untuk ngetes koneksi
  testSupabaseConnection();
});
