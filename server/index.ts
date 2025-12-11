import express from "express";
import cors from "cors";
import routes from "./routes";
import { initializeDefaultProviders } from "./aiService";

const app = express();
const PORT = parseInt(process.env.PORT || "3001");

app.use(cors());
app.use(express.json());

app.use(routes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function start() {
  try {
    await initializeDefaultProviders();
    console.log("Default AI providers initialized");
  } catch (error) {
    console.error("Failed to initialize providers:", error);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

start();
