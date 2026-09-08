/* lo user message contiene i dati specifici del capo che cambia a ogni richiesta di valutazione, insieme allo storico della sessione. 
Queste informazioni sono fornite dall'utente e non devono essere modificate dall'assistente AI.
*/
import type { PreviousValuation } from "../types/valuation.js";

export interface LookBookUserMessageInput {
  category: string;
  brand: string;
  condition: string;
  previousValuations: PreviousValuation[];
}

export const buildLookBookUserMessage = ({
  category,
  brand,
  condition,
  previousValuations,
}: LookBookUserMessageInput): string => {
  const history =
    previousValuations.length === 0
      ? "Non ci sono valutazioni precedenti in questa sessione."
      : previousValuations
        .map((valuation, index) => `
          Valutazione precedente ${index + 1}
          Categoria: ${valuation.category}
          Brand: ${valuation.brand}
          Stato: ${valuation.condition}
          Prezzo consigliato: ${valuation.suggested_price} euro
          Range: ${valuation.range_min} - ${valuation.range_max} euro
          Motivazione: ${valuation.motivation}
          Selling tips: ${valuation.selling_tips.join(" | ")}
          Data: ${valuation.created_at}
          `,
        )
        .join("\n");

  return `
Valuta il seguente capo di abbigliamento usato.

DATI DEL CAPO ATTUALE

Categoria: ${category}
Brand: ${brand}
Stato: ${condition}

Analizza anche la fotografia allegata.

STORICO DELLA SESSIONE

${history}

Lo storico precedente serve esclusivamente come contesto conversazionale.
La valutazione del capo attuale deve comunque essere effettuata sulla base dei dati e della fotografia attuale.

Utilizza le informazioni fornite dall'utente insieme agli elementi ragionevolmente visibili nell'immagine.

Restituisci la valutazione rispettando esattamente il formato JSON richiesto dal system prompt.
`;
};