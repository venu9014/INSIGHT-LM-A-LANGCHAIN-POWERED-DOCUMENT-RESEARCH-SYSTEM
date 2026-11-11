import React, { useState } from 'react';
import {
  X,
  FileText,
  Search,
  BookOpen,
  HelpCircle,
  Sparkles,
  GitCompare,
  Video,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { DocumentItem } from '../../types';

interface DocumentViewerModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onAsk: (doc: DocumentItem) => void;
  onSummarize: (doc: DocumentItem) => void;
  onCompare: (doc: DocumentItem) => void;
  onCreateVideo: (doc: DocumentItem) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  onClose,
  onAsk,
  onSummarize,
  onCompare,
  onCreateVideo
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchWord, setSearchWord] = useState('');

  if (!document) return null;

  const totalPages = document.pages || 28;
  const pageEntries = document.pageContent || [
    {
      pageNumber: 1,
      text: `${document.name} — Abstract and introduction. This research establishes theoretical and empirical foundations for high-dimensional representation learning, dense retrieval, and transformer architectures.`
    },
    {
      pageNumber: 3,
      text: 'Section 2: Related Work & Classical Baselines. Sequential recurrent architectures introduce severe memory bottlenecks that limit parallelization. In this work, attention mechanisms operate across representation subspaces.'
    },
    {
      pageNumber: 7,
      text: 'Section 3: Mathematical Formulation. The proposed system computes dot-product similarities scaled by dimensionality square root. Cosine vectors in ChromaDB reflect dense topological clusters.'
    },
    {
      pageNumber: 12,
      text: 'Section 4: Empirical Experiments & Benchmark Evaluation. Table 3 presents accuracy metrics across academic benchmarks. Grounded retrieval achieves a 42% mitigation in hallucination rates.'
    }
  ];

  const activePageText = pageEntries.find((p) => p.pageNumber === currentPage)?.text ||
    `Page ${currentPage}: [Detailed text chunk extracted from ${document.name}]. This section discusses mathematical lemmas, empirical ablations, and token attention distributions across high-dimensional latent manifolds. Indexed in ChromaDB under chunk ID ${document.sourceId}-P${currentPage}.`;

  const highlightedText = () => {
    if (!searchWord.trim()) return activePageText;
    const parts = activePageText.split(new RegExp(`(${searchWord})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchWord.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 dark:bg-amber-500/80 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-academic-950/70 backdrop-blur-xs select-none">
      <div className="bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-800 rounded-3xl max-w-6xl w-full h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-academic-100 dark:border-academic-800 flex items-center justify-between bg-academic-50/50 dark:bg-academic-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-academic-900 dark:text-white truncate max-w-md">
                  {document.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  ✓ {document.status}
                </span>
              </div>
              <p className="text-xs text-academic-500 dark:text-academic-400">
                {document.type} • {totalPages} Pages • {document.size} • Source ID: {document.sourceId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-academic-400 hover:text-academic-700 dark:hover:text-academic-200 hover:bg-academic-100 dark:hover:bg-academic-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Split Screen Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Side: Document Preview & Page Navigation (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col border-r border-academic-200 dark:border-academic-800 h-full overflow-hidden bg-academic-50/30 dark:bg-academic-950/20">
            {/* Search Inside Document Bar */}
            <div className="p-3 border-b border-academic-200/70 dark:border-academic-800 bg-white dark:bg-academic-900 flex items-center justify-between gap-3 text-xs">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-academic-400" />
                <input
                  type="text"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                  placeholder="Search keywords inside document..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-academic-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Page Navigator Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 rounded-lg border border-academic-200 dark:border-academic-700 disabled:opacity-40 hover:bg-academic-100 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono text-xs px-2 text-academic-700 dark:text-academic-300 font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1 rounded-lg border border-academic-200 dark:border-academic-700 disabled:opacity-40 hover:bg-academic-100 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Document Page Reader Viewport */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto custom-scrollbar">
              <div className="max-w-2xl mx-auto bg-white dark:bg-academic-900 p-8 rounded-2xl shadow-md border border-academic-200/80 dark:border-academic-800 min-h-[500px] space-y-6">
                <div className="flex justify-between items-center text-[10px] font-mono text-academic-400 border-b border-academic-100 dark:border-academic-800 pb-3">
                  <span>DOCUMENT EXTRACT: {document.name}</span>
                  <span>PAGE {currentPage}</span>
                </div>

                <div className="text-sm font-serif leading-relaxed text-academic-800 dark:text-academic-200 space-y-4">
                  <p>{highlightedText()}</p>
                </div>

                <div className="pt-6 border-t border-academic-100 dark:border-academic-800/80 flex items-center justify-between text-[11px] text-academic-400">
                  <span>ChromaDB Passage Vectors Grounded</span>
                  <span className="font-mono">{document.chunksCount || 142} total chunks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Integrated Research Tools (4 Cols) */}
          <div className="lg:col-span-4 p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-5 bg-white dark:bg-academic-900">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-academic-400 block mb-1">
                  Active Research Tools
                </h4>
                <p className="text-xs text-academic-600 dark:text-academic-300">
                  Execute direct AI workflows on this document:
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Ask about this document */}
                <button
                  onClick={() => {
                    onClose();
                    onAsk(document);
                  }}
                  className="w-full p-3 rounded-xl border border-academic-200 dark:border-academic-800 hover:border-primary-400 bg-academic-50/60 dark:bg-academic-800/40 hover:bg-white transition-all text-left group flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 mt-0.5">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-academic-900 dark:text-white group-hover:text-primary-600">
                      Ask about this document
                    </h5>
                    <p className="text-[11px] text-academic-500 mt-0.5">
                      Ground inquiries strictly in this paper with page citations.
                    </p>
                  </div>
                </button>

                {/* Summarize */}
                <button
                  onClick={() => {
                    onClose();
                    onSummarize(document);
                  }}
                  className="w-full p-3 rounded-xl border border-academic-200 dark:border-academic-800 hover:border-emerald-400 bg-academic-50/60 dark:bg-academic-800/40 hover:bg-white transition-all text-left group flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-academic-900 dark:text-white group-hover:text-emerald-600">
                      Summarize paper
                    </h5>
                    <p className="text-[11px] text-academic-500 mt-0.5">
                      Generate executive, methodological, or beginner breakdowns.
                    </p>
                  </div>
                </button>

                {/* Compare */}
                <button
                  onClick={() => {
                    onClose();
                    onCompare(document);
                  }}
                  className="w-full p-3 rounded-xl border border-academic-200 dark:border-academic-800 hover:border-amber-400 bg-academic-50/60 dark:bg-academic-800/40 hover:bg-white transition-all text-left group flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 mt-0.5">
                    <GitCompare className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-academic-900 dark:text-white group-hover:text-amber-600">
                      Compare with other papers
                    </h5>
                    <p className="text-[11px] text-academic-500 mt-0.5">
                      Compare objectives, benchmarks, and uncover research gaps.
                    </p>
                  </div>
                </button>

                {/* Create Learning Video */}
                <button
                  onClick={() => {
                    onClose();
                    onCreateVideo(document);
                  }}
                  className="w-full p-3 rounded-xl border border-academic-200 dark:border-academic-800 hover:border-purple-400 bg-academic-50/60 dark:bg-academic-800/40 hover:bg-white transition-all text-left group flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 mt-0.5">
                    <Video className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-academic-900 dark:text-white group-hover:text-purple-600">
                      Create learning video
                    </h5>
                    <p className="text-[11px] text-academic-500 mt-0.5">
                      Draft a 5-scene educational script and visual video preview.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Document Metadata Summary Box */}
            <div className="p-4 rounded-xl bg-academic-50 dark:bg-academic-800/50 border border-academic-200/60 dark:border-academic-700/60 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-academic-400 block">
                Metadata & Authors
              </span>
              <p className="font-semibold text-academic-900 dark:text-white">
                {document.authors || 'Principal Investigator et al.'}
              </p>
              {document.doi && (
                <p className="font-mono text-[11px] text-primary-600 dark:text-primary-400">
                  DOI: {document.doi}
                </p>
              )}
              {document.abstract && (
                <p className="text-academic-500 dark:text-academic-400 text-[11px] leading-relaxed line-clamp-3">
                  {document.abstract}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
