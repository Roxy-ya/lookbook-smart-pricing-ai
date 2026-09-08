import { supabase } from "../config/supabaseClient.js";

import { AppError } from "../errors/AppError.js";

import type {
    PreviousValuation,
    ValuationResult,
} from "../types/valuation.js";

interface SaveValuationInput {
    sessionId: string;
    category: string;
    brand: string;
    condition: string;
    result: ValuationResult;
}

/* 
se sessionId esiste già, allora usa quella esistente,
altrimenti crea una nuova sessione con quell'ID.
*/
export const ensureSessionExists = async (
    sessionId: string,
): Promise<void> => {
    const { error } = await supabase
        .from("sessions")
        .upsert(
            {
                id: sessionId,
            },
            {
                onConflict: "id",
            },
        );

    if (error) {
        console.error("Errore Supabase - sessione:", error);

        throw new AppError(
            "Non è stato possibile salvare la sessione. Riprova più tardi.",
            503,
        );
    }
};

export const getSessionHistory = async (
    sessionId: string,
): Promise<PreviousValuation[]> => {
    const { data, error } = await supabase
        .from("valuations")
        .select(
            `
        category,
        brand,
        condition,
        suggested_price,
        range_min,
        range_max,
        motivation,
        selling_tips,
        created_at
      `,
        )
        .eq("session_id", sessionId)
        .order("created_at", {
            ascending: false, // le 5 piu recenti
        })
        .limit(5); //Si mantiene la persistenza completa senza far crescere il prompt all’infinito.

    if (error) {
        console.error("Errore Supabase - storico:", error);

        throw new AppError(
            "Non è stato possibile recuperare lo storico della sessione.",
            503,
        );
    }

    return ((data ?? []) as PreviousValuation[]).reverse();
};

// salva la valutazione nel database, associandola alla sessione corrente
export const saveValuation = async ({
    sessionId,
    category,
    brand,
    condition,
    result,
}: SaveValuationInput): Promise<void> => {
    const { error } = await supabase.from("valuations").insert({
        session_id: sessionId,
        category,
        brand,
        condition,
        suggested_price: result.suggested_price,
        range_min: result.range.min,
        range_max: result.range.max,
        motivation: result.motivation,
        selling_tips: result.selling_tips,
    });

    if (error) {
        console.error("Errore Supabase - valutazione:", error);

        throw new AppError(
            "La valutazione è stata generata, ma non è stato possibile salvarla.",
            503,
        );
    }
};