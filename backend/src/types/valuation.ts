export interface ValuationResult {
    suggested_price: number;
    range: {
        min: number;
        max: number;
    };
    motivation: string;
    selling_tips: string[];
}

export interface PreviousValuation {
    category: string;
    brand: string;
    condition: string;
    suggested_price: number;
    range_min: number;
    range_max: number;
    motivation: string;
    selling_tips: string[];
    created_at: string;
}