import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Download,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Check,
  Globe,
  Sliders,
  Layers,
  Database
} from 'lucide-react';
import { DocumentItem, SummaryResult } from '../../types';
import { sampleSummary } from '../../data/sampleData';
import { RAGService } from '../../services/ragService';

interface ResearchSummarizerProps {
  documents: DocumentItem[];
  onSaveToBookmarks: (item: { title: string; subtitle?: string; content: string; source: string; type: 'summary' }) => void;
}

export const ResearchSummarizer: React.FC<ResearchSummarizerProps> = ({
  documents,
  onSaveToBookmarks
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || 'doc-1');
  const [summaryType, setSummaryType] = useState<SummaryResult['summaryType']>('Detailed Research Summary');
  const [length, setLength] = useState<'Short' | 'Medium' | 'Long'>('Medium');
  const [audience, setAudience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isLoading, setIsLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(sampleSummary);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleGenerateSummary = async () => {
    if (!selectedDoc) return;
    setIsLoading(true);
    setIsSaved(false);
    try {
      const result = await RAGService.generateSummary(
        selectedDoc.id,
        selectedDoc.name,
        summaryType,
        length,
        audience,
        selectedDoc
      );
      setSummaryResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summaryResult) return;
    const text = `RESEARCH SUMMARY: ${summaryResult.documentName}\n` +
      `TYPE: ${summaryResult.summaryType} | AUDIENCE: ${summaryResult.audience}\n\n` +
      `ABSTRACT:\n${summaryResult.abstract}\n\n` +
      `PROBLEM STATEMENT:\n${summaryResult.problemStatement}\n\n` +
      `METHODOLOGY:\n${summaryResult.methodology}\n\n` +
      `DATASET: ${summaryResult.dataset || 'N/A'}\n\n` +
      `MODEL / ALGORITHM: ${summaryResult.modelAlgorithm || 'N/A'}\n\n` +
      `RESULTS:\n${summaryResult.results?.map((r, i) => `${i + 1}. ${r}`).join('\n') || 'N/A'}\n\n` +
      `ADVANTAGES:\n${summaryResult.advantages?.map((a) => `• ${a}`).join('\n') || 'N/A'}\n\n` +
      `LIMITATIONS:\n${summaryResult.limitations.map((l) => `• ${l}`).join('\n')}\n\n` +
      `FUTURE SCOPE:\n${summaryResult.futureScope || 'N/A'}\n\n` +
      `CONCLUSION:\n${summaryResult.conclusion}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!summaryResult) return;
    const text = `ACADEMIC SUMMARY: ${summaryResult.documentName}\n` +
      `============================================================\n` +
      `Mode: ${summaryResult.summaryType} | Length: ${summaryResult.length} | Audience: ${summaryResult.audience}\n` +
      `Generated: ${summaryResult.generatedAt}\n\n` +
      `1. ABSTRACT\n${summaryResult.abstract}\n\n` +
      `2. PROBLEM STATEMENT\n${summaryResult.problemStatement}\n\n` +
      `3. METHODOLOGY\n${summaryResult.methodology}\n\n` +
      `4. DATASET\n${summaryResult.dataset || 'N/A'}\n\n` +
      `5. MODEL & ALGORITHM\n${summaryResult.modelAlgorithm || 'N/A'}\n\n` +
      `6. RESULTS\n${summaryResult.results?.map((r, i) => `   ${i + 1}. ${r}`).join('\n') || 'N/A'}\n\n` +
      `7. ADVANTAGES\n${summaryResult.advantages?.map((a) => `   - ${a}`).join('\n') || 'N/A'}\n\n` +
      `8. LIMITATIONS\n${summaryResult.limitations.map((l) => `   - ${l}`).join('\n')}\n\n` +
      `9. FUTURE SCOPE\n${summaryResult.futureScope || 'N/A'}\n\n` +
      `10. CONCLUSION\n${summaryResult.conclusion}\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summaryResult.documentName.replace('.pdf', '')}_Summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    if (!summaryResult) return;
    const text = `# Academic Summary: ${summaryResult.documentName}\n\n` +
      `**Summary Mode**: ${summaryResult.summaryType} | **Length**: ${summaryResult.length} | **Audience**: ${summaryResult.audience}\n\n` +
      `## Abstract\n${summaryResult.abstract}\n\n` +
      `## Problem Statement\n${summaryResult.problemStatement}\n\n` +
      `## Methodology\n${summaryResult.methodology}\n\n` +
      `## Dataset\n${summaryResult.dataset || 'N/A'}\n\n` +
      `## Model / Algorithm\n${summaryResult.modelAlgorithm || 'N/A'}\n\n` +
      `## Results\n${summaryResult.results?.map((r) => `- ${r}`).join('\n') || 'N/A'}\n\n` +
      `## Advantages\n${summaryResult.advantages?.map((a) => `- ${a}`).join('\n') || 'N/A'}\n\n` +
      `## Limitations\n${summaryResult.limitations.map((l) => `- ${l}`).join('\n')}\n\n` +
      `## Future Scope\n${summaryResult.futureScope || 'N/A'}\n\n` +
      `## Conclusion\n${summaryResult.conclusion}\n`;

    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summaryResult.documentName.replace('.pdf', '')}_Summary.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!summaryResult) return;
    onSaveToBookmarks({
      title: `${summaryResult.summaryType}: ${summaryResult.documentName}`,
      subtitle: `Audience: ${summaryResult.audience} • Length: ${summaryResult.length}`,
      content: summaryResult.abstract,
      source: summaryResult.documentName,
      type: 'summary'
    });
    setIsSaved(true);
  };

  const summaryModes: Array<SummaryResult['summaryType']> = [
    'Executive Summary',
    'Detailed Research Summary',
    'Beginner Explanation',
    'Key Findings',
    'Methodology Summary',
    'Research Paper Breakdown'
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-academic-900 dark:text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <span>Research Summarizer</span>
        </h2>
        <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
          Generate structured literature extracts across 6 research modes: Abstract, Problem Statement, Methodology, Dataset, Algorithm, Results, Advantages, Limitations, Future Scope, and Conclusion.
        </p>
      </div>

      {/* Control Panel */}
      <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Document Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 block mb-2">
              Select Research Document
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs font-semibold text-academic-900 dark:text-white focus:outline-none"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  📄 {doc.name} ({doc.pages} pages)
                </option>
              ))}
            </select>

            <div className="mt-4 space-y-2 text-xs">
              <label className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 block">
                Audience Level
              </label>
              <div className="flex gap-1.5">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map((aud) => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => setAudience(aud)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      audience === aud
                        ? 'bg-primary-600 text-white shadow-2xs'
                        : 'bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-300'
                    }`}
                  >
                    {aud}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Mode Selector */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 block">
              Summary Mode ({summaryModes.length} Types)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {summaryModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSummaryType(mode)}
                  className={`p-2.5 rounded-xl text-xs font-semibold transition-all text-left truncate border cursor-pointer ${
                    summaryType === mode
                      ? 'bg-primary-50 dark:bg-primary-950 border-primary-400 dark:border-primary-700 text-primary-700 dark:text-primary-300 shadow-2xs'
                      : 'bg-academic-50 dark:bg-academic-800/60 border-academic-200 dark:border-academic-700 text-academic-600 dark:text-academic-400 hover:bg-academic-100'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-academic-400 font-semibold">Length Depth:</span>
                {(['Short', 'Medium', 'Long'] as const).map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setLength(len)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      length === len
                        ? 'bg-primary-600 text-white'
                        : 'bg-academic-100 dark:bg-academic-800 text-academic-600'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerateSummary}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isLoading ? 'Synthesizing...' : 'Generate Summary'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result Section */}
      {summaryResult && (
        <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 select-text">
          {/* Top Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-academic-100 dark:border-academic-800 gap-3">
            <div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                {summaryResult.summaryType} • {summaryResult.length} • {summaryResult.audience} Level
              </span>
              <h3 className="text-lg font-bold text-academic-900 dark:text-white mt-1.5">
                {summaryResult.documentName}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 text-academic-700 dark:text-academic-300 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 text-academic-700 dark:text-academic-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Download Markdown summary"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download .md</span>
              </button>
              <button
                onClick={handleDownloadTxt}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 text-academic-700 dark:text-academic-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Download Plain Text summary"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download .txt</span>
              </button>
              <button
                onClick={handleSave}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isSaved
                    ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 border border-primary-300'
                    : 'bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 text-academic-700 dark:text-academic-300'
                }`}
              >
                {isSaved ? <BookmarkCheck className="h-3.5 w-3.5 text-primary-600" /> : <Bookmark className="h-3.5 w-3.5" />}
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Structured Scientific Output Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Abstract */}
            <div className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Abstract
              </h4>
              <p className="text-xs text-academic-700 dark:text-academic-300 leading-relaxed font-serif">
                {summaryResult.abstract}
              </p>
            </div>

            {/* Problem Statement */}
            <div className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                Problem Statement & Research Motivation
              </h4>
              <p className="text-xs text-academic-700 dark:text-academic-300 leading-relaxed">
                {summaryResult.problemStatement}
              </p>
            </div>
          </div>

          {/* Methodology & Dataset & Algorithm */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                Methodology
              </h4>
              <p className="text-xs text-academic-700 dark:text-academic-300 leading-relaxed">
                {summaryResult.methodology}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-academic-600 dark:text-academic-300">
                Dataset & Benchmarks
              </h4>
              <p className="text-xs text-academic-700 dark:text-academic-300 leading-relaxed">
                {summaryResult.dataset || 'WMT 2014 & GLUE benchmark datasets.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Model / Algorithm
              </h4>
              <p className="text-xs text-academic-700 dark:text-academic-300 leading-relaxed font-mono">
                {summaryResult.modelAlgorithm || 'Scaled Dot-Product Multi-Head Attention'}
              </p>
            </div>
          </div>

          {/* Results & Advantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Experimental Results
              </h4>
              <ul className="space-y-1 text-xs text-academic-700 dark:text-academic-300">
                {summaryResult.results?.map((res, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600">•</span>
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-academic-800 dark:text-academic-200 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary-500" />
                Key Advantages
              </h4>
              <ul className="space-y-1 text-xs text-academic-700 dark:text-academic-300">
                {summaryResult.advantages?.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-primary-600">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Limitations & Future Scope */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                Limitations
              </h4>
              <ul className="space-y-1 text-xs text-academic-700 dark:text-academic-300">
                {summaryResult.limitations.map((lim, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">•</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-academic-800 dark:text-academic-200">
                Future Scope
              </h4>
              <p className="text-xs text-academic-700 dark:text-academic-300 leading-relaxed">
                {summaryResult.futureScope || 'Exploring linear-complexity attention variants and multimodal scientific knowledge graph integration.'}
              </p>
            </div>
          </div>

          {/* Conclusion */}
          <div className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-academic-700 dark:text-academic-300">
              Conclusion
            </h4>
            <p className="text-xs text-academic-700 dark:text-academic-300 leading-relaxed">
              {summaryResult.conclusion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
