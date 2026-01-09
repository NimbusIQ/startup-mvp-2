import React from 'react';
import { PageTitle, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';

const TechnicalWhitepaper: React.FC = () => {
    const whitepaperContent = `
# Nimbus IQ: The Sovereign PropTech Ecosystem
**Project ID:** cs-host-6690eb946b7648f9849a2d  
**Architecture:** Multi-Modal RAG + Agentic Quantum Mesh  
**Status:** Solid State Transformation (v3.5.0)

---

## 1. Executive Summary: The AI OS
Nimbus IQ is a **Sovereign AI Operating System** engineered to eliminate human clerical latency. It functions as a "Company-in-a-Box" for the construction and property sector, leveraging Gemini 3 for reasoning and high-performance Python frameworks for agentic orchestration.

---

## 2. High-Level Architecture
Our foundation is built on **Deterministic Integrity**, where model outputs are validated against regional logic matrices before execution.

### Layer 1: The MML-RAG Ingestion
*   **Satellite Telemetry**: Ingests TIFF/PNG data for roof footprint analysis.
*   **Forensic Vision**: Gemini 3 Flash identifies hail damage markers in sub-100ms cycles.
*   **Compliance Grounding**: Vector retrieval of Texas IRC 2021 codes.

### Layer 2: The Python Agentic Core
*   **FastAPI / Pydantic**: The "Solid State" backend that ensures all agent communication is strictly typed and deterministic.
*   **Task Swarms**: Quantum production agents that handle scheduling, billing, and dispatch autonomously.
*   **MCP Protocol**: Model Context Protocol used to hot-swap between insurance databases and live meteorological feeds.

---

## 3. The Production Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Brain** | Gemini 3 Pro | High-budget reasoning for complex code auditing. |
| **Vision/Voice** | Gemini 3 Flash | Low-latency sensory inference. |
| **Backend** | Python (FastAPI) | High-concurrency agentic web framework. |
| **Orchestration** | GKE Autopilot | Elastic scaling for 50+ agentic micro-services. |
| **Storage** | AlloyDB | Transactional + Vector memory storage. |

---

## 4. Agentic Quantum Logic
Production agents utilize a "Quantum State" model where each task is an independent probability that is collapsed into a deterministic outcome via peer-agent verification.

\`\`\`python
# Example Agentic Quantum Logic in Python (FastAPI/Pydantic)
from pydantic import BaseModel
from typing import List

class AgenticDecision(BaseModel):
    decision_id: str
    confidence_rating: float
    logic_chain: List[str]
    verification_sig: str

@app.post("/v1/agent/validate")
async def validate_claim(evidence: Buffer):
    # Process visual evidence via Gemini Vision
    # Cross-reference with Building Codes in AlloyDB
    # Return a deterministic verification signature
    return AgenticDecision(...)
\`\`\`

---

## 5. Maximizing Investment
Every line of code is written to minimize latency and maximize ROI. We "trim" the human oversight required by implementing robust "Teacher" curriculum models that supervise autonomous "Student" swarms.

---

## 6. Security & Air-Gapped Integrity
*   **Verification Signatures**: All outputs carry cryptographic signatures.
*   **Residency**: Data resides strictly in US-CENTRAL1.
*   **Access**: SOC2-compliant RBAC for all internal agentic mesh communication.
`;

    return (
        <div className="flex flex-col h-full animate-fade-in space-y-12">
            <PageTitle 
                title="Core IP Whitepaper" 
                subtitle="The technical blueprint for the Nimbus IQ Sovereign AI Ecosystem." 
            />

            <div className="max-w-5xl mx-auto w-full">
                <div className="bg-[#0f172a]/80 border border-slate-800 rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden text-left">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500"></div>
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <MaterialSymbol icon="shield" className="text-[200px]" />
                    </div>

                    <div className="prose prose-invert prose-indigo lg:prose-xl max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {whitepaperContent}
                        </ReactMarkdown>
                    </div>

                    <div className="mt-20 pt-12 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                <MaterialSymbol icon="verified" className="text-3xl text-indigo-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Sovereign Validation</p>
                                <p className="text-sm font-bold text-white uppercase tracking-tight">Verified Technical Standard v3.5.0</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <ActionButton variant="secondary" icon={<MaterialSymbol icon="download" />}>Export PDF</ActionButton>
                            <ActionButton variant="primary" icon={<MaterialSymbol icon="share" />}>Push to GCloud</ActionButton>
                        </div>
                    </div>
                </div>
                
                <div className="mt-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700">Proprietary Assets of Nimbus IQ AI, LLC • Python Web Dev / Agentic Quantum production agents</p>
                </div>
            </div>
        </div>
    );
};

export default TechnicalWhitepaper;