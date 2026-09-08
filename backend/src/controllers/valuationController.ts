import type { Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import {
  ensureSessionExists,
  getSessionHistory,
  saveValuation,
} from "../services/persistenceService.js";
import { getAIValuation } from "../services/valuationService.js";
import { encodeImageToBase64 } from "../utils/imageUtils.js";

const allowedCategories = [
  "T-shirt",
  "Camicia",
  "Felpa",
  "Maglione",
  "Giacca",
  "Cappotto",
  "Pantaloni",
  "Jeans",
  "Gonna",
  "Vestito",
  "Scarpe",
  "Borsa",
  "Altro",
];

const allowedConditions = [
  "Nuovo",
  "Buono",
  "Usato",
];

//createValuation gestisce la richiesta di valutazione di un capo d'abbigliamento. 
// Valida i dati in ingresso, interagisce con il servizio AI per ottenere una valutazione e salva il risultato nel database. ù
// Restituisce la valutazione al client o un messaggio di errore in caso di problemi.
export const createValuation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { category, brand, condition, sessionId } = req.body;

  const image = req.file;

  if (!image || !category || !brand || !condition || !sessionId) {
    res.status(400).json({
      error: "Foto, categoria, brand, stato e sessionId sono obbligatori.",
    });

    return;
  }

  const normalizedBrand = String(brand).trim();

  if (!normalizedBrand) {
    res.status(400).json({
      error: "Il brand non può essere vuoto.",
    });

    return;
  }

  if (normalizedBrand.length > 100) {
    res.status(400).json({
      error: "Il brand non può superare i 100 caratteri.",
    });

    return;
  }

  if (!allowedCategories.includes(category)) {
    res.status(400).json({
      error: "Categoria non valida.",
    });

    return;
  }

  if (!allowedConditions.includes(condition)) {
    res.status(400).json({
      error: "Stato del capo non valido.",
    });

    return;
  }

  try {
    const encodedImage = encodeImageToBase64(image);

    console.log("Nuova richiesta di valutazione ricevuta:", {
      category,
      brand: normalizedBrand,
      condition,
      imageName: image.originalname,
    });

    await ensureSessionExists(sessionId);

    const previousValuations = await getSessionHistory(sessionId);

    console.log(
      `Valutazioni precedenti recuperate: ${previousValuations.length}`,
    );

    console.log("Invio richiesta all'AI...");

    const result = await getAIValuation({
      category,
      brand: normalizedBrand,
      condition,
      imageDataUrl: encodedImage.dataUrl,
      previousValuations,
    });

    console.log("Valutazione AI ricevuta.");

    await saveValuation({
      sessionId,
      category,
      brand: normalizedBrand,
      condition,
      result,
    });

    console.log("Valutazione salvata su Supabase.");

    res.json(result);
  } catch (error) {
    console.error("Errore durante la valutazione:", error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        error: error.message,
      });

      return;
    }

    res.status(500).json({
      error: "Si è verificato un errore imprevisto. Riprova più tardi.",
    });
  }
};