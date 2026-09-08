export interface EncodedImage {
  mimeType: string;
  base64: string;
  dataUrl: string;
}

//encoda un'immagine in base64 e restituisce un oggetto contenente il mimeType, la stringa base64 e il dataUrl
export const encodeImageToBase64 = (
  file: Express.Multer.File,
): EncodedImage => {
  const base64 = file.buffer.toString("base64");

  const dataUrl = `data:${file.mimetype};base64,${base64}`;

  return {
    mimeType: file.mimetype,
    base64,
    dataUrl,
  };
};