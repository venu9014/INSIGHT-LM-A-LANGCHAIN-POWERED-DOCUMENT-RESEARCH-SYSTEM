import React from 'react';
import {
  BrainCircuit,
  Cpu,
  Database,
  FileText,
  Youtube,
  GraduationCap,
  Layers,
  Sparkles,
  GitCompare,
  BookmarkCheck,
  ShieldCheck,
  CheckCircle2,
  Server,
  Code2,
  Video,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const AboutSystemView: React.FC = () => {
  const pipelineSteps = [
    {
      step: '01',
      title: 'PDF Ingestion & Text Cleaning',
      desc: 'Multipart PDF upload handled by Python PyPDF. Extracts real per-page textual streams, normalizes whitespace, strips non-printable control characters, and audits scanned/unreadable files.',
      badge: 'PyPDF 4.2'
    },
    {
      step: '02',
      title: 'Hierarchical Token Chunking',
      desc: 'Splits extracted scientific text into 512-token chunks with 10% (51-token) sliding overlap to preserve boundary context across technical formulas and theorem definitions.',
      badge: '512 Tokens / 10% Overlap'
    },
    {
      step: '03',
      title: 'ChromaDB Vector Indexing',
      desc: 'Chunks are vectorized and persisted in a local ChromaDB collection using HNSW indexing and cosine similarity metric for sub-millisecond retrieval.',
      badge: 'ChromaDB Persistent Store'
    },
    {
      step: '04',
      title: 'LangChain Grounded RAG Pipeline',
      desc: 'Top-K semantic similarity query retrieves relevant chunks with exact page numbers. Generates strictly grounded technical synthesis and honestly states when information is not present.',
      badge: 'LangChain + RAG'
    },
    {
      step: '05',
      title: 'Automated YouTube Discovery',
      desc: 'Extracts domain concepts from indexed papers and matches them with verified educational lectures (MIT, Stanford, 3Blue1Brown, Yannic Kilcher, Fireship) with embedded players.',
      badge: 'YouTube Data API v3'
    },
    {
      step: '06',
      title: 'Academic Role Personas & Assessment',
      desc: 'Tailors responses for Students (intuitive analogies), Teachers (pedagogical frameworks & exam rubrics), and Researchers (empirical rigor & literature gaps). Generates model question papers and quizzes.',
      badge: 'Multi-Persona Engine'
    }
  ];

  const techStack = [
    { category: 'Frontend Architecture', tech: 'React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons' },
    { category: 'Backend Engine', tech: 'Python 3.11, Flask 3.1, PyPDF, DuckDuckGo Search API' },
    { category: 'Vector Database & RAG', tech: 'ChromaDB 1.5.5, LangChain 1.2, HNSW Indexing' },
    { category: 'Audio & Media Synthesis', tech: 'Web Speech API Text-To-Speech (TTS), Canvas Animation' },
    { category: 'Citation Engine', tech: 'IEEE, APA 7th Edition, MLA 9th, BibTeX Export (.bib)' },
    { category: 'Persistence Layer', tech: 'ChromaDB Persistent Directory + LocalStorage State Sync' }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 select-none pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-academic-900 via-primary-950 to-academic-950 text-white border border-primary-800/40 shadow-xl">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-400/30 text-primary-300 text-xs font-semibold">
            <BrainCircuit className="h-4 w-4" />
            <span>Intelligent Document Research Assistant • System Specifications</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            AI-Powered Research & Learning Platform Architecture
          </h1>
          <p className="text-sm text-academic-300 leading-relaxed font-normal">
            A production-ready full-stack scientific research workspace combining verified PDF document parsing,
            persistent vector retrieval with ChromaDB, LangChain grounded Q&A, automatic YouTube educational video discovery,
            academic role specialization, and automated assessment generation.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-white font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Grounded RAG (Zero Hallucination)
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-white font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> ChromaDB Local Vector Store
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-white font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Verified Video Discovery
            </span>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* RAG Workflow & Processing Pipeline */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-academic-900 dark:text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <span>End-to-End Processing Workflow</span>
          </h2>
          <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
            How documents travel from raw PDF bytes to indexed vector embeddings and grounded citations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineSteps.map((s) => (
            <div
              key={s.step}
              className="p-5 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black font-mono text-primary-600 dark:text-primary-400">
                    {s.step}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-300">
                    {s.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-academic-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="text-xs text-academic-500 dark:text-academic-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-academic-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <span>Core System Capabilities</span>
          </h2>
          <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
            Integrated modules designed specifically for university students, educators, and academic researchers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
              <Database className="h-5 w-5" />
              <h3 className="font-bold text-sm text-academic-900 dark:text-white">
                ChromaDB Vector Retrieval & Grounding
              </h3>
            </div>
            <p className="text-xs text-academic-500 dark:text-academic-400 leading-relaxed">
              Every document is parsed per page, filtered into clean textual tokens, and vectorized into a persistent ChromaDB database.
              When a query arrives, similarity search retrieves the exact relevant chunk, cites the exact page number, and ensures zero hallucination. If a concept is not present in the paper, the assistant explicitly states its absence.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Youtube className="h-5 w-5" />
              <h3 className="font-bold text-sm text-academic-900 dark:text-white">
                Educational YouTube Discovery & Multi-Modal Sync
              </h3>
            </div>
            <p className="text-xs text-academic-500 dark:text-academic-400 leading-relaxed">
              Upon PDF indexing, key topics and scientific methodologies are automatically analyzed. The system queries educational resources and matches real video lectures from leading institutions (MIT, 3Blue1Brown, Yannic Kilcher) complete with verified titles, channels, durations, and embedded players.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <GraduationCap className="h-5 w-5" />
              <h3 className="font-bold text-sm text-academic-900 dark:text-white">
                Academic Role Specialization & Assessment Studio
              </h3>
            </div>
            <p className="text-xs text-academic-500 dark:text-academic-400 leading-relaxed">
              One-click switching between Student, Teacher, and Researcher roles without re-authenticating. Teachers can automatically generate Bloom's taxonomy university model question papers and interactive quizzes; Students can take timed tests with instant grading and explanations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <BookmarkCheck className="h-5 w-5" />
              <h3 className="font-bold text-sm text-academic-900 dark:text-white">
                Scientific Citation & Bibliography Generator
              </h3>
            </div>
            <p className="text-xs text-academic-500 dark:text-academic-400 leading-relaxed">
              Extracts real bibliographic metadata (Title, Authors, Year, Venue, DOI, Page ranges). Supports standard academic formats including IEEE, APA 7th Edition, MLA 9th, and BibTeX (.bib) export, along with an interactive metadata editor to ensure 100% submission accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Table */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-academic-900 dark:text-white flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <span>Full Technology Stack</span>
          </h2>
          <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
            Modern, maintainable, and type-safe open-source stack.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-academic-200/80 dark:border-academic-800 shadow-sm">
          <table className="w-full text-left text-xs bg-white dark:bg-academic-900">
            <thead className="bg-academic-50 dark:bg-academic-800/60 text-academic-700 dark:text-academic-300 font-bold uppercase text-[10px] tracking-wider border-b border-academic-200 dark:border-academic-800">
              <tr>
                <th className="py-3 px-4">Layer / Category</th>
                <th className="py-3 px-4">Technologies & Libraries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-academic-100 dark:divide-academic-800">
              {techStack.map((item, idx) => (
                <tr key={idx} className="hover:bg-academic-50/50 dark:hover:bg-academic-800/40">
                  <td className="py-3 px-4 font-semibold text-academic-900 dark:text-white whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-academic-600 dark:text-academic-400 font-mono">
                    {item.tech}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Future Roadmap */}
      <div className="p-6 rounded-2xl bg-academic-50 dark:bg-academic-900/60 border border-academic-200/80 dark:border-academic-800 space-y-3">
        <h3 className="font-bold text-sm text-academic-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-600" />
          <span>Future System Roadmap</span>
        </h3>
        <ul className="text-xs text-academic-600 dark:text-academic-400 space-y-1.5 list-disc list-inside">
          <li>Integration of GraphRAG (Knowledge Graph triplets combined with dense vector representations).</li>
          <li>Direct Zotero and Mendeley library synchronization via OAuth2 plugins.</li>
          <li>Multi-lingual cross-lingual semantic embedding support for non-English academic repositories.</li>
          <li>Automated LaTeX document generation and Overleaf direct sync.</li>
        </ul>
      </div>
    </div>
  );
};
