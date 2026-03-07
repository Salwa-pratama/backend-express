import app from "./app";

const PORT = process.env.APP_PORT || 1915;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
