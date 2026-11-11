import React, { useState } from 'react';
import {
  Compass,
  Search,
  Sparkles,
  ExternalLink,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Tag,
  HelpCircle,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ResearchExplorerResult } from '../../types';
import { RAGService } from '../../services/ragService';

export const ResearchExplorer: React.FC = () => {
  const [topic, setTopic] = useState('Retrieval-Augmented Generation in Scientific Literature');
  const [depth, setDepth] = useState<'Quick Research' | 'Standard Research' | 'Deep Research'>('Standard Research');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResearchExplorerResult | null>(null);

  const handleExplore = async (topicToExplore?: string) => {
    const t = topicToExplore || topic;
    if (!t.trim()) return;

    setIsLoading(true);
    try {
      const data = await RAGService.exploreTopic(t, depth);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleTopics = [
    'Graph-Augmented Retrieval (GraphRAG)',
    'Self-Reflective RAG (Self-RAG)',
    'Hallucination Mitigation in Large Language Models',
    'High-Dimensional Vector Search with HNSW & ChromaDB',
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-academic-900 dark:text-white flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <span>Research Explorer</span>
        </h2>
        <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
          Explore research topics, uncover key scientific concepts, identify emerging literature trends, and discover open thesis research gaps.
        </p>
      </div>

      {/* Search & Configuration Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 block mb-1.5">
            Research Topic or Domain
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-academic-400" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Retrieval-Augmented Generation in Scientific Literature"
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-academic-900 dark:text-white placeholder-academic-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-medium"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          {/* Depth Modes */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-academic-400 font-semibold">Research Depth:</span>
            {(['Quick Research', 'Standard Research', 'Deep Research'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setDepth(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  depth === mode
                    ? 'bg-primary-600 text-white shadow-2xs'
                    : 'bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-400 hover:bg-academic-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleExplore()}
            disabled={isLoading || !topic.trim()}
            className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isLoading ? 'Exploring Literature...' : 'Explore Topic'}</span>
          </button>
        </div>

        {/* Suggested Topics */}
        <div className="pt-2 border-t border-academic-100 dark:border-academic-800/80 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-academic-400 font-semibold">Suggested:</span>
          {sampleTopics.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                setTopic(st);
                handleExplore(st);
              }}
              className="px-2.5 py-1 rounded-lg bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 dark:hover:bg-academic-700 text-academic-700 dark:text-academic-300 transition-colors"
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6 select-text">
          {/* Overview Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                {result.depth} • Synthesized {result.generatedAt}
              </span>
              <span className="text-xs text-academic-400 font-mono">Academic Literature Analysis</span>
            </div>
            <h3 className="text-lg font-bold text-academic-900 dark:text-white">
              {result.topic}
            </h3>
            <p className="text-xs sm:text-sm text-academic-700 dark:text-academic-300 leading-relaxed font-serif">
              {result.overview}
            </p>
          </div>

          {/* Key Concepts Grid */}
          <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              Foundational Concepts & Definitions
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.keyConcepts.map((kc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-1"
                >
                  <h5 className="font-bold text-xs text-academic-900 dark:text-white">
                    {kc.term}
                  </h5>
                  <p className="text-xs text-academic-600 dark:text-academic-300 leading-relaxed">
                    {kc.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Important Findings & Trends */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Findings */}
            <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Key Empirical Findings
              </h4>
              <ul className="space-y-2 text-xs text-academic-700 dark:text-academic-300">
                {result.importantFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trends */}
            <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-primary-500" />
                Emerging Research Directions
              </h4>
              <ul className="space-y-2 text-xs text-academic-700 dark:text-academic-300">
                {result.researchTrends.map((trend, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-primary-600">•</span>
                    <span>{trend}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Potential Research Gaps & Thesis Opportunities */}
          <div className="p-6 rounded-2xl bg-primary-50/50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary-800 dark:text-primary-300 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-primary-600" />
              Unexplored Research Gaps & Thesis Opportunities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {result.potentialResearchGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-academic-900 border border-primary-200/80 dark:border-primary-850 text-xs space-y-1"
                >
                  <span className="font-mono text-[10px] font-bold text-primary-600">
                    GAP #{idx + 1}
                  </span>
                  <p className="text-academic-700 dark:text-academic-300 leading-relaxed font-medium">
                    {gap}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Foundational Citations / Academic References */}
          <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Foundational Scientific References ({result.sources.length} Publications)
              </h4>
              <span className="text-[11px] text-academic-400 font-mono">Peer-Reviewed Literature</span>
            </div>

            <div className="space-y-3">
              {result.sources.map((src, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-academic-200 dark:border-academic-800 hover:border-primary-400 dark:hover:border-primary-600 bg-academic-50/50 dark:bg-academic-800/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-academic-200 dark:bg-academic-700 text-academic-700 dark:text-academic-300 font-semibold">
                        {src.domain}
                      </span>
                      <span className="text-xs text-academic-400 font-mono">{src.year}</span>
                    </div>
                    <h5 className="font-bold text-xs sm:text-sm text-academic-900 dark:text-white">
                      {src.title}
                    </h5>
                    <p className="text-xs text-academic-600 dark:text-academic-300 font-serif">
                      {src.description}
                    </p>
                  </div>

                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:bg-academic-50 flex items-center gap-1.5 self-start sm:self-center shrink-0"
                  >
                    <span>Read Paper</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
