import React from 'react';
import { FileText, Youtube, ExternalLink } from 'lucide-react';
import { ResearchSource } from '../../types';

interface SourceCardProps {
  source: ResearchSource;
  onOpenSourceModal: (source: ResearchSource) => void;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, onOpenSourceModal }) => {
  const isYoutube = source.sourceType === 'youtube';

  return (
    <button
      onClick={() => onOpenSourceModal(source)}
      className="p-3 rounded-xl border border-academic-200 dark:border-academic-800 bg-academic-50/70 dark:bg-academic-800/40 hover:bg-white dark:hover:bg-academic-800 hover:border-primary-400 dark:hover:border-primary-600 transition-all text-left group shadow-2xs flex items-start gap-2.5 cursor-pointer max-w-sm"
    >
      <div className={`p-2 rounded-lg mt-0.5 group-hover:scale-105 transition-transform ${
        isYoutube
          ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'
          : 'bg-primary-100/70 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300'
      }`}>
        {isYoutube ? <Youtube className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs font-bold text-academic-800 dark:text-academic-200 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {source.documentName}
          </p>
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-academic-200/60 dark:bg-academic-700/60 text-academic-600 dark:text-academic-300">
            {isYoutube ? `▶ ${source.timestamp || '04:12'}` : `P. ${source.page}`}
          </span>
        </div>

        <p className="text-[11px] text-academic-500 dark:text-academic-400 line-clamp-2 mt-1 italic font-serif">
          "{source.snippet}"
        </p>

        <div className="mt-2 flex items-center justify-between text-[10px] text-academic-400 pt-1 border-t border-academic-200/40 dark:border-academic-700/40">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
            Cosine Sim: {(source.similarityScore * 100).toFixed(1)}%
          </span>
          <span className="flex items-center gap-0.5 text-primary-600 dark:text-primary-400 group-hover:underline">
            Inspect source <ExternalLink className="h-2.5 w-2.5" />
          </span>
        </div>
      </div>
    </button>
  );
};
