import express from "express";
import cors from "cors";
import valuationRoutes from "./routes/valuationRoutes.js";
import { OPENAI_MODEL } from "./config/openaiClient.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Configura CORS per consentire richieste solo da origini specifiche
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://lookbook-smart-pricing-ai.netlify.app",
];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "LookBook Smart Pricing AI backend is running",
  });
});

app.use("/api/valuation", valuationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`OpenAI model configured: ${OPENAI_MODEL}`);
});