import { Router } from "express";
import multer from "multer";

import { createValuation } from "../controllers/valuationController.js";
import { uploadErrorHandler } from "../middlewares/uploadErrorHandler.js";

const router = Router();

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

// Configurazione di multer per la gestione del caricamento dei file
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(
        new Error("Formato immagine non supportato. Usa JPG, PNG oppure WEBP."),
      );

      return;
    }

    callback(null, true);
  },
});

router.post(
  "/",
  upload.single("image"),
  createValuation,
);

router.use(uploadErrorHandler);

export default router;