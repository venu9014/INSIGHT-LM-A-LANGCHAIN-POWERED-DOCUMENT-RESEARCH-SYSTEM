import React from 'react';
import { X, FileText, CheckCircle2, Copy, BookOpen } from 'lucide-react';
import { ResearchSource } from '../../types';

interface SourceViewerModalProps {
  source: ResearchSource | null;
  onClose: () => void;
}

export const SourceViewerModal: React.FC<SourceViewerModalProps> = ({ source, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!source) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(source.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-academic-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-academic-100 dark:border-academic-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-academic-900 dark:text-white">
                Retrieved Source Excerpt
              </h3>
              <p className="text-xs text-academic-500 dark:text-academic-400">
                {source.documentName} • Page {source.page}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-academic-400 hover:text-academic-700 dark:hover:text-academic-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-xs">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Verified ChromaDB Chunk
            </span>
            <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">
              Similarity: {(source.similarityScore * 100).toFixed(1)}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/70 dark:border-academic-700/60">
            <p className="text-xs text-academic-700 dark:text-academic-300 leading-relaxed font-serif italic selection:bg-primary-200">
              "{source.snippet}"
            </p>
          </div>

          <div className="text-[11px] text-academic-400 space-y-1">
            <p>• Chunk partition: 512-token semantic boundary</p>
            <p>• Embedding model: text-embedding-004 (768-dim)</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-academic-50 dark:bg-academic-800/50 border-t border-academic-100 dark:border-academic-800 flex items-center justify-end gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-academic-200/80 dark:bg-academic-700 hover:bg-academic-300 text-academic-800 dark:text-academic-200 transition-colors flex items-center gap-1.5"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Excerpt'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
