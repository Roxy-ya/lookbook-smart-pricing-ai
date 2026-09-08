/* la risposta DEVE essere un oggetto */
export const valuationJsonSchema = {
  type: "object",
  properties: {
    suggested_price: {
      type: "number",
    },

    range: {
      type: "object",
      properties: {
        min: {
          type: "number",
        },
        max: {
          type: "number",
        },
      },
      required: ["min", "max"],
      additionalProperties: false,
    },

    motivation: {
      type: "string",
    },

    selling_tips: {
      type: "array",
      items: {
        type: "string",
      },
      minItems: 3,
      maxItems: 3,
    },
  },

  required: [
    "suggested_price",
    "range",
    "motivation",
    "selling_tips",
  ],

  additionalProperties: false,
};