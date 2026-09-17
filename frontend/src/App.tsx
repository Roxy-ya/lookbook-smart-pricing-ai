import { useEffect, useRef, useState } from "react";

interface ValuationResult {
  suggested_price: number;
  range: {
    min: number;
    max: number;
  };
  motivation: string;
  selling_tips: string[];
}

// Generare un ID univoco per la sessione dell'utente e memorizzarlo nel localStorage.
const getOrCreateSessionId = (): string => {
  const storedSessionId = localStorage.getItem("lookbook_session_id");

  if (storedSessionId) {
    return storedSessionId;
  }

  const newSessionId = crypto.randomUUID();

  localStorage.setItem("lookbook_session_id", newSessionId);

  return newSessionId;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("");

  const [sessionId] = useState(() => getOrCreateSessionId());

  const [result, setResult] = useState<ValuationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Gestisce il cambiamento dell'immagine selezionata dall'utente.
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    setError("");

    if (!file) {
      setImage(null);
      setImagePreview(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImage(null);
      setImagePreview(null);

      setError(
        "Formato immagine non supportato. Usa JPG, PNG oppure WEBP.",
      );

      event.target.value = "";

      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImage(null);
      setImagePreview(null);

      setError(
        "L'immagine è troppo grande. La dimensione massima consentita è 5 MB.",
      );

      event.target.value = "";

      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImage(file);
    setImagePreview(previewUrl);
  };

  // Gestisce il reset del form e dei risultati della valutazione.
  const handleReset = () => {
    setImage(null);
    setImagePreview(null);

    setCategory("");
    setBrand("");
    setCondition("");

    setResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!image) {
      return;
    }

    // Rimuove eventuali spazi bianchi all'inizio e alla fine del brand.
    const trimmedBrand = brand.trim();

    if (!trimmedBrand) {
      setError("Inserisci un brand valido.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    // Crea un oggetto FormData per inviare i dati al server.
    const formData = new FormData();

    formData.append("image", image);
    formData.append("category", category);
    formData.append("brand", trimmedBrand);
    formData.append("condition", condition);
    formData.append("sessionId", sessionId);

    try {
      const response = await fetch(
        `${API_URL}/api/valuation`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.error ||
          "Errore durante la valutazione del capo.",
        );
      }

      // Parsing della risposta JSON e aggiornamento dello stato con i risultati della valutazione.
      const data: ValuationResult = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Non è stato possibile ottenere la valutazione. Riprova più tardi.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <header className="page-header">
        <h1>LookBook Smart Pricing AI</h1>

        <p>
          Carica un capo e ottieni in pochi secondi una stima del prezzo di vendita, un range realistico e consigli personalizzati.
        </p>
      </header>

      <section className="valuation-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="image">Foto del capo</label>

            <span className="field-hint">
              JPG, PNG o WEBP · max 5 MB
            </span>

            <input
              ref={fileInputRef}
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              onChange={handleImageChange}
            />

            {imagePreview && (
              <div className="image-preview">
                <img
                  src={imagePreview}
                  alt="Anteprima del capo caricato"
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoria</label>

            <select
              id="category"
              value={category}
              required
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              <option value="">Seleziona una categoria</option>
              <option value="T-shirt">T-shirt</option>
              <option value="Camicia">Camicia</option>
              <option value="Felpa">Felpa</option>
              <option value="Maglione">Maglione</option>
              <option value="Giacca">Giacca</option>
              <option value="Cappotto">Cappotto</option>
              <option value="Pantaloni">Pantaloni</option>
              <option value="Jeans">Jeans</option>
              <option value="Gonna">Gonna</option>
              <option value="Vestito">Vestito</option>
              <option value="Scarpe">Scarpe</option>
              <option value="Borsa">Borsa</option>
              <option value="Altro">Altro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="brand">Brand</label>

            <input
              id="brand"
              type="text"
              placeholder="Es. Levi's"
              value={brand}
              required
              maxLength={100}
              onChange={(event) =>
                setBrand(event.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="condition">Stato</label>

            <select
              id="condition"
              value={condition}
              required
              onChange={(event) =>
                setCondition(event.target.value)
              }
            >
              <option value="">Seleziona lo stato</option>
              <option value="Nuovo">Nuovo</option>
              <option value="Buono">Buono</option>
              <option value="Usato">Usato</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? (
              <span className="button-loading">
                <span className="spinner" />
                Valutazione in corso...
              </span>
            ) : (
              "Valuta"
            )}
          </button>
        </form>

        {loading && (
          <div className="loading-message">
            <div className="spinner large-spinner" />

            <div>
              <strong>Stiamo analizzando il tuo capo</strong>

              <p>
                Valutando foto,
                brand, categoria e stato.
              </p>
            </div>
          </div>
        )}
      </section>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {result && (
        <section className="result-card">
          <h2>Valutazione</h2>

          <div className="price">
            <span>Prezzo consigliato</span>
            <strong>€{result.suggested_price}</strong>
          </div>

          <p>
            <strong>Range realistico:</strong>{" "}
            €{result.range.min} - €{result.range.max}
          </p>

          <div>
            <h3>Motivazione</h3>
            <p>{result.motivation}</p>
          </div>

          <div>
            <h3>Consigli per vendere più velocemente</h3>

            <ul>
              {result.selling_tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
          >
            Nuova valutazione
          </button>
        </section>
      )}
    </main>
  );
}

export default App;