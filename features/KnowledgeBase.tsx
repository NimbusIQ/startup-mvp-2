import React, { useState } from 'react';
import { PageTitle, Tab, TabGroup, ActionButton } from '../components/shared';
import { MaterialSymbol } from '../components/icons';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';
import remarkGfm from 'https://esm.sh/remark-gfm@4';

type DocSection = 'os-curriculum' | 'agentic-pedagogy' | 'safety-foundation' | 'python-quantum-logic';

const KnowledgeBase: React.FC = () => {
    const [activeSection, setActiveSection] = useState<DocSection>('os-curriculum');

    // Ensured content object is a valid Record and correctly terminated with a semicolon to avoid call signature errors
    const content: Record<DocSection, string> = {
        'os-curriculum': `
# The Sovereign OS Curriculum v2.0

Nimbus IQ functions as a pedagogical framework for PropTech. This curriculum defines how the OS "teaches" administrative intelligence to eliminate human clerical latency.

### 📚 Learning Verticals
*   **Visual Forensics**: Distinguishing environmental wear from acute damage with 99.9% deterministic accuracy.
*   **Regulatory Compliance**: Native integration of IRC/IBC building codes into the neural reasoning layer.
*   **Operational Fluency**: Training agents to handle the "Spreadsheet-to-JSON" pipeline without human oversight.

### 🧠 Maximize Investment
We prioritize **High-ROI Cognition**. Every compute cycle spent by an agent must result in a $10x reduction in clerical overhead. This is the foundation of our "Training and Trimming" philosophy.
        `,
        'agentic-pedagogy': `
# Agentic Pedagogy (AG2AG Logic)

We implement "Teacher" models that supervise "Worker" swarms. This creates a self-refining pedagogical loop.

### 🤝 The Negotiation Mesh
*   **Supervisor Agents**: Lead teachers that validate output quality against forensic standards.
*   **Quantum Production Agents**: Execution nodes built for high-concurrency PropTech workflows.
*   **Audit Protocols**: Trimming latency by moving from human-in-the-loop to human-on-the-loop.

### 📉 Latency Trimming
By refining the instruction foundation, we've reduced token-to-decision time by 45% in the latest Flux Orbit update.
        `,
        'safety-foundation': `
# Safety Foundation & Hardening

Drawing in safety features is not an afterthought; it is the skeletal structure of Nimbus IQ.

### 🛡️ Security Pillars
*   **Verification Signatures**: Cryptographic fingerprints for every model output to ensure auditability.
*   **Air-Gapped Logic**: Sensitive financial and PII data is processed in isolated US-CENTRAL1 nodes.
*   **Biometric Gates**: High-value executions require multi-factor sovereign verification.

### 🔍 Grounding Matrix
All curriculum updates are grounded in real-time Search and Maps data, ensuring the "teacher" (the AI) is never hallucinating market shifts.
        `,
        'python-quantum-logic': `
# Python Web Frameworks & Agentic Quantum

The "Quantum Production Agents" utilize a high-performance Python-centric backend stack to interface with the frontend.

### 🐍 The Backend Engine
*   **FastAPI / Django Ninja**: Used for high-speed, type-safe API routing between agentic nodes.
*   **Asynchronous Processing**: Trimming task latency using Python's \`asyncio\` for non-blocking agent communication.
*   **Deterministic Serialization**: Leveraging Pydantic for strict JSON schema enforcement—crucial for construction data integrity.

### ⚛️ Quantum Production Flow
Quantum agents operate as sub-atomic state machines, ensuring that even if one node fails, the sovereign mesh maintains operational continuity. This is the peak of investment maximization.
        `
    };

    return (
        <div className="flex flex-col h-full animate-fade-in">
            <PageTitle 
                title="Sovereign AI Curriculum" 
                subtitle="Refining the foundation of PropTech intelligence through advanced agentic pedagogy." 
            />

            <TabGroup>
                <Tab label="OS Curriculum" icon="school" isActive={activeSection === 'os-curriculum'} onClick={() => setActiveSection('os-curriculum')} />
                <Tab label="Agent Pedagogy" icon="psychology" isActive={activeSection === 'agentic-pedagogy'} onClick={() => setActiveSection('agentic-pedagogy')} />
                <Tab label="Safety Foundation" icon="security" isActive={activeSection === 'safety-foundation'} onClick={() => setActiveSection('safety-foundation')} />
                <Tab label="Quantum Logic" icon="terminal" isActive={activeSection === 'python-quantum-logic'} onClick={() => setActiveSection('python-quantum-logic')} />
            </TabGroup>

            <div className="flex-grow bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 md:p-16 overflow-y-auto custom-scrollbar shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none grayscale">
                    <MaterialSymbol icon="auto_stories" className="text-[300px]" />
                </div>

                <div className="max-w-4xl mx-auto prose prose-invert prose-indigo lg:prose-xl prose-headings:font-black prose-headings:tracking-tighter prose-strong:text-indigo-400">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content[activeSection]}
                    </ReactMarkdown>
                </div>

                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex items-center space-x-5">
                        <img src="https://storage.googleapis.com/aistudio-ux-team-data/demos/nimbus-logo.png" className="h-10 w-10 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" alt="Logo" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Foundation Standard v3.5</p>
                            <p className="text-xs font-bold text-white uppercase tracking-tight">Sovereign Teacher Training Protocol</p>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <ActionButton variant="secondary" className="px-6 py-2.5 text-[10px]" icon={<MaterialSymbol icon="menu_book" />}>Download Curriculum</ActionButton>
                        <ActionButton variant="secondary" className="px-6 py-2.5 text-[10px]" icon={<MaterialSymbol icon="share" />}>Submit Feedback</ActionButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBase;