import express from "express";
import cors from "cors";
import valuationRoutes from "./routes/valuationRoutes.js";
import { OPENAI_MODEL } from "./config/openaiClient.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "LookBook Smart Pricing AI backend is running",
  });
});

app.use("/api/valuation", valuationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`OpenAI model configured: ${OPENAI_MODEL}`);
});