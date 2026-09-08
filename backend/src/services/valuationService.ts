import { openai, OPENAI_MODEL } from "../config/openaiClient.js";

import { AppError } from "../errors/AppError.js";

import { LOOKBOOK_SYSTEM_PROMPT } from "../prompts/lookBookSystemPrompt.js";
import { buildLookBookUserMessage } from "../prompts/lookBookUserMessage.js";

import { valuationJsonSchema } from "../schemas/valuationSchema.js";

import type {
  PreviousValuation,
  ValuationResult,
} from "../types/valuation.js";

interface CreateValuationInput {
  category: string;
  brand: string;
  condition: string;
  imageDataUrl: string;
  previousValuations: PreviousValuation[];
}

/* 
 getAIValuation è una funzione asincrona che prende in input i dettagli di un capo di abbigliamento e 
 le valutazioni precedenti, costruisce un messaggio per l'utente, 
 invia la richiesta al modello OpenAI e restituisce il risultato della valutazione. 
 Se il modello non restituisce una risposta valida o se il prezzo suggerito non rientra nel range, viene generato un errore.
 */
export const getAIValuation = async ({
  category,
  brand,
  condition,
  imageDataUrl,
  previousValuations,
}: CreateValuationInput): Promise<ValuationResult> => {
  const userMessage = buildLookBookUserMessage({
    category,
    brand,
    condition,
    previousValuations,
  });

  try {
    const response = await openai.responses.create({
      model: OPENAI_MODEL,

      text: {
        format: {
          type: "json_schema",
          name: "lookbook_valuation",
          strict: true,
          schema: valuationJsonSchema,
        },
      },

      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: LOOKBOOK_SYSTEM_PROMPT,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: userMessage,
            },
            {
              type: "input_image",
              image_url: imageDataUrl,
              detail: "auto",
            },
          ],
        },
      ],
    });

    const outputText = response.output_text;

    if (!outputText) {
      throw new Error("Il modello non ha restituito una risposta.");
    }

    const result = JSON.parse(outputText) as ValuationResult;

    if (
      result.range.min > result.suggested_price ||
      result.range.max < result.suggested_price
    ) {
      throw new Error(
        "Il prezzo suggerito non rientra nel range restituito.",
      );
    }

    return result;
  } catch (error) {
    console.error("Errore OpenAI:", error);

    throw new AppError(
      "Il servizio AI non è temporaneamente disponibile. Riprova tra poco.",
      502,
    );
  }
};