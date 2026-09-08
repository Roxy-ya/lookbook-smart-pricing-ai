import "dotenv/config";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY non trovata. Controlla il file backend/.env.");
}

if (!model) {
  throw new Error("OPENAI_MODEL non trovato. Controlla il file backend/.env.");
}

export const openai = new OpenAI({
  apiKey,
});

export const OPENAI_MODEL = model;