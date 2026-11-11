import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Database,
  Cpu,
  Moon,
  Sun,
  ArrowDown,
  Info,
  Shield,
  Lock,
  Server,
  Code2,
  FileCode2,
  Layers
} from 'lucide-react';

interface SettingsViewProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ darkMode, setDarkMode }) => {
  const [model, setModel] = useState('Gemini / compatible Generative AI');
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-004 (768-dim)');
  const [temperature, setTemperature] = useState(0.2);
  const [topK, setTopK] = useState(4);
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(50);
  const [activeArchTab, setActiveArchTab] = useState<'rag' | 'video'>('rag');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-academic-900 dark:text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <span>System Settings & Architecture</span>
        </h2>
        <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
          Technical specifications, model hyperparameters, retrieval configurations, and production Python backend integration guidelines.
        </p>
      </div>

      {/* Demo Notice Banner */}
      <div className="p-4 rounded-2xl bg-primary-50/70 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 flex items-start gap-3 text-xs">
        <Info className="h-5 w-5 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-academic-800 dark:text-academic-200">
          <p className="font-bold text-primary-900 dark:text-primary-200">
            Demo Data & Architecture Notice (Requirement 27 & 29)
          </p>
          <p className="text-academic-600 dark:text-academic-300 leading-relaxed text-[11px]">
            The platform is operating in <strong>Prototype Demonstration Mode</strong>. Realistic academic literature, source excerpts, and simulated retrieval latencies are loaded so the system is fully evaluatable before physical backend deployment. When external API keys or the Python backend are connected, the modular service layer switches seamlessly without requiring UI redesign.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Settings Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Model & Embeddings */}
          <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-academic-900 dark:text-white pb-3 border-b border-academic-100 dark:border-academic-800 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              AI & Retrieval Engine Models
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-academic-700 dark:text-academic-300 block mb-1">
                  Generative AI Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-academic-900 dark:text-white focus:outline-none"
                >
                  <option value="Gemini / compatible Generative AI">Gemini / compatible Generative AI (Default)</option>
                  <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Google DeepMind)</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                  <option value="GPT-4o">GPT-4o (OpenAI)</option>
                  <option value="Llama-3-70B-Instruct">Llama-3-70B-Instruct (Self-Hosted)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-academic-700 dark:text-academic-300 block mb-1">
                  Embedding Model (Vector Space)
                </label>
                <select
                  value={embeddingModel}
                  onChange={(e) => setEmbeddingModel(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-academic-900 dark:text-white focus:outline-none"
                >
                  <option value="text-embedding-004 (768-dim)">text-embedding-004 (768-dim) — High Precision</option>
                  <option value="BAAI/bge-large-en-v1.5 (1024-dim)">BAAI/bge-large-en-v1.5 (1024-dim)</option>
                  <option value="text-embedding-3-large (1536-dim)">text-embedding-3-large (1536-dim)</option>
                  <option value="all-MiniLM-L6-v2 (384-dim)">all-MiniLM-L6-v2 (384-dim, Fast Local)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Retrieval Hyperparameters */}
          <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-academic-900 dark:text-white pb-3 border-b border-academic-100 dark:border-academic-800 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              Retrieval & Grounding Hyperparameters
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-academic-700 dark:text-academic-300 mb-1">
                  <span>Temperature (Factual Determinism):</span>
                  <span className="font-mono text-primary-600 dark:text-primary-400">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-primary-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-academic-400 mt-1">
                  <span>0.0 (Strict Scientific Grounding)</span>
                  <span>1.0 (Creative Exploratory)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-academic-700 dark:text-academic-300 mb-1">
                  <span>Number of Retrieved Chunks (Top-K):</span>
                  <span className="font-mono text-primary-600 dark:text-primary-400">{topK} chunks</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={topK}
                  onChange={(e) => setTopK(parseInt(e.target.value))}
                  className="w-full accent-primary-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-semibold text-academic-700 dark:text-academic-300 block mb-1">
                    Chunk Size (Tokens)
                  </label>
                  <input
                    type="number"
                    value={chunkSize}
                    onChange={(e) => setChunkSize(parseInt(e.target.value) || 512)}
                    className="w-full px-3 py-2 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-academic-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-academic-700 dark:text-academic-300 block mb-1">
                    Chunk Overlap (Tokens)
                  </label>
                  <input
                    type="number"
                    value={chunkOverlap}
                    onChange={(e) => setChunkOverlap(parseInt(e.target.value) || 50)}
                    className="w-full px-3 py-2 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-academic-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security & Production Readiness (Requirement 24) */}
          <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-academic-900 dark:text-white pb-3 border-b border-academic-100 dark:border-academic-800 flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              Security & Environment Isolation (Requirement 24)
            </h3>

            <div className="space-y-3 text-xs text-academic-600 dark:text-academic-300">
              <div className="p-3 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-1">
                <p className="font-bold text-academic-800 dark:text-academic-200 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-primary-500" />
                  API Key & Secret Protection
                </p>
                <p className="text-[11px] leading-relaxed">
                  No LLM API keys are stored or exposed in client bundles. In production, requests route through secure backend proxy endpoints reading environment variables (<code>OPENAI_API_KEY</code>, <code>GEMINI_API_KEY</code>).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-1">
                <p className="font-bold text-academic-800 dark:text-academic-200 flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-indigo-500" />
                  User-Specific Corpus Isolation
                </p>
                <p className="text-[11px] leading-relaxed">
                  Vector collections in ChromaDB are partitioned with multi-tenant namespaces keyed by <code>user_id</code>, ensuring strict data privacy across students, teachers, and researchers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: About System & Technology Stack (Requirement 23) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-academic-100 dark:border-academic-800">
              <h3 className="text-sm font-bold text-academic-900 dark:text-white flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-600" />
                <span>About System & Technology Stack</span>
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Final Year Project
              </span>
            </div>

            {/* Tech Stack Table (Requirement 23) */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-academic-100 dark:border-academic-800/60">
                <span className="text-academic-500 dark:text-academic-400">Programming:</span>
                <span className="font-semibold text-academic-800 dark:text-academic-200 font-mono">Python</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-academic-100 dark:border-academic-800/60">
                <span className="text-academic-500 dark:text-academic-400">Frontend:</span>
                <span className="font-semibold text-academic-800 dark:text-academic-200 font-mono">Streamlit / Web UI</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-academic-100 dark:border-academic-800/60">
                <span className="text-academic-500 dark:text-academic-400">AI Orchestration:</span>
                <span className="font-semibold text-academic-800 dark:text-academic-200 font-mono">LangChain</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-academic-100 dark:border-academic-800/60">
                <span className="text-academic-500 dark:text-academic-400">Retrieval Approach:</span>
                <span className="font-semibold text-academic-800 dark:text-academic-200 font-mono">RAG (Dense Cosine)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-academic-100 dark:border-academic-800/60">
                <span className="text-academic-500 dark:text-academic-400">Vector Database:</span>
                <span className="font-semibold text-academic-800 dark:text-academic-200 font-mono">ChromaDB</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-academic-100 dark:border-academic-800/60">
                <span className="text-academic-500 dark:text-academic-400">LLM:</span>
                <span className="font-semibold text-academic-800 dark:text-academic-200 font-mono">Gemini / compatible</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-academic-100 dark:border-academic-800/60">
                <span className="text-academic-500 dark:text-academic-400">PDF Processing:</span>
                <span className="font-semibold text-academic-800 dark:text-academic-200 font-mono">PyPDF</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-academic-500 dark:text-academic-400">Video Generation:</span>
                <span className="font-semibold text-academic-800 dark:text-academic-200 font-mono">TTS + Visuals + FFmpeg</span>
              </div>
            </div>
          </div>

          {/* Flow Diagrams */}
          <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveArchTab('rag')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeArchTab === 'rag'
                    ? 'bg-primary-600 text-white'
                    : 'bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-400'
                }`}
              >
                LangChain + RAG Flow
              </button>
              <button
                onClick={() => setActiveArchTab('video')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeArchTab === 'video'
                    ? 'bg-primary-600 text-white'
                    : 'bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-400'
                }`}
              >
                Video Pipeline Flow
              </button>
            </div>

            {activeArchTab === 'rag' ? (
              <div className="space-y-1 text-xs font-mono">
                {[
                  'PDF Document Upload',
                  'Text Extraction (PyPDF)',
                  'Text Cleaning & Normalization',
                  'Chunking (512 tokens, 10% overlap)',
                  'Embeddings Generation',
                  'ChromaDB Vector Store (HNSW)',
                  'Retriever (Cosine Similarity)',
                  'LangChain Orchestration',
                  'Relevant Context Augmentation',
                  'Generative AI (LLM)',
                  'Grounded Answer'
                ].map((step, idx, arr) => (
                  <React.Fragment key={step}>
                    <div className="p-2 rounded-lg bg-academic-50 dark:bg-academic-800/50 border border-academic-200/60 dark:border-academic-700/60 text-center font-semibold text-academic-800 dark:text-academic-200">
                      {step}
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="flex justify-center my-0.5 text-primary-500">
                        <ArrowDown className="h-3 w-3" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="space-y-1 text-xs font-mono">
                {[
                  'Research Source (PDF / YouTube)',
                  'Content Extraction',
                  'LangChain Analysis',
                  'Key Concept Extraction',
                  'Educational Script Generation',
                  'Scene Generation & Planning',
                  'Visual Instructions & Diagrams',
                  'Text-to-Speech (TTS)',
                  'Captions & Subtitle Alignment',
                  'FFmpeg Video Composition',
                  'Final MP4 Output'
                ].map((step, idx, arr) => (
                  <React.Fragment key={step}>
                    <div className="p-2 rounded-lg bg-academic-50 dark:bg-academic-800/50 border border-academic-200/60 dark:border-academic-700/60 text-center font-semibold text-academic-800 dark:text-academic-200">
                      {step}
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="flex justify-center my-0.5 text-primary-500">
                        <ArrowDown className="h-3 w-3" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
