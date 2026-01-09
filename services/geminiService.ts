import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * NIMBUS IQ CORE INFERENCE SCHEMA (B2B_PREMIUM)
 * Deterministic output protocol for construction and property workflows.
 */
export const roofInferenceSchema = {
  type: Type.OBJECT,
  properties: {
    analysis_metadata: {
      type: Type.OBJECT,
      properties: {
        confidence_rating: { type: Type.NUMBER, description: "0.0 to 1.0 based on image clarity and marker detection." },
        processing_mode: { type: Type.STRING, description: "B2B_PREMIUM" },
        model_version: { type: Type.STRING }
      },
      required: ["confidence_rating", "processing_mode", "model_version"]
    },
    roof_specs: {
      type: Type.OBJECT,
      properties: {
        material_identified: { type: Type.STRING, description: "e.g., Asphalt Shingle, Duration Storm, Class 4 Metal" },
        estimated_sq_ft: { type: Type.INTEGER, description: "Calculated based on facet count and standard dimensions." },
        facet_count: { type: Type.INTEGER },
        predominant_pitch: { type: Type.STRING, description: "Estimated slope (e.g., 6:12, 8:12)" },
        waste_factor_percentage: { type: Type.STRING, description: "Recommended waste (usually 10-15%)" }
      },
      required: ["material_identified", "estimated_sq_ft", "facet_count", "predominant_pitch", "waste_factor_percentage"]
    },
    damage_assessment: {
      type: Type.OBJECT,
      properties: {
        hail_impact_detected: { type: Type.BOOLEAN },
        granule_loss_detected: { type: Type.BOOLEAN },
        mechanical_damage_detected: { type: Type.BOOLEAN },
        severity_score: { type: Type.INTEGER, description: "1-10 intensity rating" },
        notes: { type: Type.STRING, description: "Technical summary of visual evidence." }
      },
      required: ["hail_impact_detected", "granule_loss_detected", "mechanical_damage_detected", "severity_score", "notes"]
    },
    market_valuation: {
      type: Type.OBJECT,
      properties: {
        est_replacement_cost_low: { type: Type.INTEGER },
        est_replacement_cost_high: { type: Type.INTEGER },
        currency: { type: Type.STRING }
      },
      required: ["est_replacement_cost_low", "est_replacement_cost_high", "currency"]
    }
  },
  required: ["analysis_metadata", "roof_specs", "damage_assessment", "market_valuation"]
};

/**
 * NUX CORE INFERENCE ENGINE
 * High-precision computer vision analysis for the Shingle Shield AI product.
 */
export async function runRoofInference(imageBase64: string, mimeType: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType
          }
        },
        {
          text: `Act as the Nimbus IQ Core Inference Engine. Perform high-precision computer vision analysis for roofing/construction.
          OPERATIONAL MANDATE:
          1. DATA EXTRACTION: Analyze roof material (shingle type), facet count, and damage markers (hail impact, granule loss, mechanical damage).
          2. DIMENSIONAL ESTIMATION: Use architectural visual cues and standard builder specs (6:12 pitch baseline) to estimate total roofing squares.
          3. COMPLIANCE: Adhere to Texas-specific construction standards (e.g., Duration Storm shingles, Class 4 impact resistance).
          OUTPUT: Respond in strictly valid JSON conforming to the Nimbus IQ Schema.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: roofInferenceSchema,
      temperature: 0.1
    }
  });

  return JSON.parse(response.text);
}