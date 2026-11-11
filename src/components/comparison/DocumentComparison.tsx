import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  Download,
  Lightbulb
} from 'lucide-react';
import { DocumentItem, ComparisonReport } from '../../types';
import { RAGService } from '../../services/ragService';

interface DocumentComparisonProps {
  documents: DocumentItem[];
  onSaveToBookmarks: (item: { title: string; subtitle?: string; content: string; source: string; type: 'summary' }) => void;
}

export const DocumentComparison: React.FC<DocumentComparisonProps> = ({
  documents,
  onSaveToBookmarks
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    documents.slice(0, 3).map((d) => d.id)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ComparisonReport | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const togglePaper = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 2) return;
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 5) return;
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCompare = async () => {
    setIsLoading(true);
    setIsSaved(false);
    try {
      const compReport = await RAGService.compareDocuments(selectedIds, documents);
      setReport(compReport);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleCompare();
  }, []);

  const selectedDocs = documents.filter((d) => selectedIds.includes(d.id));

  const handleCopyMatrix = () => {
    if (!report) return;
    const header = ['Category', ...selectedDocs.map((d) => d.name)].join('\t');
    const rows = report.dimensions
      .map((dim) => [dim.category, ...selectedDocs.map((d) => dim.values[d.name] || 'N/A')].join('\t'))
      .join('\n');
    navigator.clipboard.writeText(`${header}\n${rows}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!report) return;
    onSaveToBookmarks({
      title: `Comparative Matrix (${selectedDocs.length} Papers)`,
      subtitle: selectedDocs.map((d) => d.name).join(', '),
      content: `Compared across 10 academic categories including Problem, Methodology, Dataset, Algorithm, Results, Advantages, and Limitations. Identified ${report.insights.possibleResearchGaps.length} potential research gaps.`,
      source: selectedDocs.map((d) => d.name).join(', '),
      type: 'summary'
    });
    setIsSaved(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 select-none">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-academic-900 dark:text-white flex items-center gap-2">
          <GitCompare className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <span>Compare Research Papers</span>
        </h2>
        <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
          Synthesize a 10-row comparative matrix across 2 to 5 research publications to evaluate architectural trade-offs and uncover unaddressed research gaps.
        </p>
      </div>

      {/* Document Selection Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400">
            Selected Papers for Matrix ({selectedIds.length}/5)
          </span>
          <span className="text-xs text-academic-400">
            Click to toggle papers (min 2, max 5)
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {documents.map((doc) => {
            const isSelected = selectedIds.includes(doc.id);
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => togglePaper(doc.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-primary-50 dark:bg-primary-950 border-primary-400 dark:border-primary-700 text-primary-800 dark:text-primary-200 font-semibold shadow-2xs'
                    : 'bg-academic-50 dark:bg-academic-800/60 border-academic-200 dark:border-academic-700 text-academic-600 dark:text-academic-400 hover:bg-academic-100'
                }`}
              >
                <span>{isSelected ? '✓' : '+'}</span>
                <span>{doc.name}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleCompare}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isLoading ? 'Computing Comparative Matrix...' : 'Compare Documents'}</span>
          </button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {report && (
        <div className="space-y-6 select-text">
          <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-academic-100 dark:border-academic-800 bg-academic-50/50 dark:bg-academic-800/30 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-academic-900 dark:text-white">
                  Cross-Paper Architectural & Methodological Matrix (10 Dimensions)
                </h3>
                <span className="text-[11px] font-mono text-academic-500">
                  {selectedDocs.length} Papers Contrasted
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMatrix}
                  className="px-3 py-1.5 rounded-lg border border-academic-200 dark:border-academic-700 hover:bg-academic-100 text-xs font-semibold text-academic-700 dark:text-academic-300 transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied Matrix!' : 'Copy Table'}</span>
                </button>
                <button
                  onClick={handleSave}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isSaved
                      ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 border border-primary-300'
                      : 'border border-academic-200 dark:border-academic-700 hover:bg-academic-100 text-academic-700 dark:text-academic-300'
                  }`}
                >
                  {isSaved ? <BookmarkCheck className="h-3.5 w-3.5 text-primary-600" /> : <Bookmark className="h-3.5 w-3.5" />}
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-academic-200 dark:border-academic-800 bg-academic-50/70 dark:bg-academic-800/50 text-[11px] font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400">
                    <th className="py-3 px-4 w-48 border-r border-academic-200/60 dark:border-academic-800">
                      Category
                    </th>
                    {selectedDocs.map((doc) => (
                      <th
                        key={doc.id}
                        className="py-3 px-4 min-w-[240px] border-r last:border-r-0 border-academic-200/60 dark:border-academic-800 text-academic-800 dark:text-academic-200"
                      >
                        <div className="line-clamp-1">{doc.name}</div>
                        <span className="text-[10px] text-academic-400 font-normal font-mono">
                          {doc.type}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-academic-100 dark:divide-academic-800 text-xs">
                  {report.dimensions.map((dim) => (
                    <tr
                      key={dim.category}
                      className="hover:bg-academic-50/50 dark:hover:bg-academic-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-academic-800 dark:text-academic-200 bg-academic-50/30 dark:bg-academic-800/20 border-r border-academic-200/60 dark:border-academic-800">
                        {dim.category}
                      </td>
                      {selectedDocs.map((doc) => {
                        const val = dim.values[doc.name] || 'N/A';
                        return (
                          <td
                            key={doc.id}
                            className="py-3.5 px-4 text-academic-600 dark:text-academic-300 border-r last:border-r-0 border-academic-200/60 dark:border-academic-800 leading-relaxed"
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Research Insight Section */}
          <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-academic-100 dark:border-academic-800">
              <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-academic-900 dark:text-white">
                  AI Research Insight & Cross-Study Evaluation
                </h3>
                <p className="text-xs text-academic-500 dark:text-academic-400">
                  Synthesized comparative conclusions, structural trade-offs, and promising thesis exploration pathways.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Common Approaches */}
              <div className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-academic-800 dark:text-academic-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary-500" />
                  Common Approaches
                </h4>
                <ul className="space-y-1.5 text-xs text-academic-600 dark:text-academic-300">
                  {report.insights.commonApproaches.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-primary-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Major Differences */}
              <div className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-academic-800 dark:text-academic-200 flex items-center gap-1.5">
                  <GitCompare className="h-3.5 w-3.5 text-indigo-500" />
                  Major Differences
                </h4>
                <ul className="space-y-1.5 text-xs text-academic-600 dark:text-academic-300">
                  {report.insights.majorDifferences.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Strengths */}
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  Strengths
                </h4>
                <ul className="space-y-1.5 text-xs text-academic-600 dark:text-academic-300">
                  {report.insights.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                  Weaknesses
                </h4>
                <ul className="space-y-1.5 text-xs text-academic-600 dark:text-academic-300">
                  {report.insights.weaknesses.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-bold text-amber-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Possible Research Gaps */}
            <div className="p-4 rounded-xl bg-primary-50/60 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary-800 dark:text-primary-300 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-primary-600" />
                Possible Research Gaps & Thesis Opportunities
              </h4>
              <div className="space-y-2 text-xs text-academic-700 dark:text-academic-300">
                {report.insights.possibleResearchGaps.map((gap, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-primary-600 font-mono">[{idx + 1}]</span>
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
