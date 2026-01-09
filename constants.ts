import { Type } from "@google/genai";

export const XACTIMATE_VALIDATOR_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    audit_summary: {
      type: Type.OBJECT,
      properties: {
        total_line_items_reviewed: { type: Type.INTEGER },
        discrepancies_found: { type: Type.INTEGER },
        compliance_score: { type: Type.NUMBER, description: "0-100 score of code adherence" },
        fraud_risk_probability: { type: Type.NUMBER, description: "0.0 to 1.0 probability of carrier padding or over-scoping" }
      },
      required: ["total_line_items_reviewed", "discrepancies_found", "compliance_score", "fraud_risk_probability"]
    },
    code_discrepancies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          line_item_ref: { type: Type.STRING },
          violation_type: { type: Type.STRING, description: "e.g., Missing Code Upgrade, Incorrect Material Grade" },
          relevant_code_section: { type: Type.STRING, description: "e.g., IRC 2021 R905.2.1" },
          required_action: { type: Type.STRING },
          cost_impact: { type: Type.NUMBER }
        },
        required: ["line_item_ref", "violation_type", "relevant_code_section", "required_action"]
      }
    },
    fraud_alerts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          alert_severity: { type: Type.STRING, description: "LOW, MEDIUM, CRITICAL" },
          description: { type: Type.STRING },
          redundancy_check: { type: Type.STRING, description: "Explanation of over-lapping line items found" }
        }
      }
    }
  },
  required: ["audit_summary", "code_discrepancies"]
};

export const STORM_DATE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    event_verification: {
      type: Type.OBJECT,
      properties: {
        is_verified: { type: Type.BOOLEAN },
        confidence: { type: Type.NUMBER },
        recorded_hail_size: { type: Type.STRING },
        recorded_wind_gusts: { type: Type.STRING },
        data_source: { type: Type.STRING }
      },
      required: ["is_verified", "confidence", "recorded_hail_size", "recorded_wind_gusts"]
    },
    meteorological_timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timestamp: { type: Type.STRING },
          condition: { type: Type.STRING },
          severity_marker: { type: Type.STRING }
        }
      }
    },
    sovereign_recommendation: { type: Type.STRING }
  },
  required: ["event_verification", "meteorological_timeline"]
};
