import type { NextFunction, Request, Response } from "express";
import multer from "multer";

//uploadErrorHandler gestisce gli errori che possono verificarsi durante il caricamento dei file con multer.
//multer è un middleware per la gestione dei file multipart/form-data.
export const uploadErrorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction,
): void => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            res.status(400).json({
                error: "L'immagine è troppo grande. La dimensione massima è 5 MB.", //Anche se c'è la validazione lato FE è sempre meglio aggiungere BE per sicurezza
            });

            return;
        }

        res.status(400).json({
            error: "Errore durante il caricamento dell'immagine.",
        });

        return;
    }

    if (error instanceof Error) {
        res.status(400).json({
            error: error.message,
        });

        return;
    }

    next(error);
};