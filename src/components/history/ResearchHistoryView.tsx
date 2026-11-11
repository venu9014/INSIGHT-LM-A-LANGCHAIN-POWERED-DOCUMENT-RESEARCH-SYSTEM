import React, { useState } from 'react';
import { History, Search, Trash2, Bookmark, BookmarkCheck, FileText, MessageSquare, Video, GitCompare, Youtube, Compass, ArrowRight, ExternalLink } from 'lucide-react';
import { HistoryItem } from '../../types';

interface ResearchHistoryViewProps {
  history: HistoryItem[];
  onDeleteHistory: (id: string) => void;
  onToggleSaveHistory: (id: string) => void;
  onOpenHistoryItem: (item: HistoryItem) => void;
}

export const ResearchHistoryView: React.FC<ResearchHistoryViewProps> = ({
  history,
  onDeleteHistory,
  onToggleSaveHistory,
  onOpenHistoryItem
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredHistory = history.filter((item) => {
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.summaryText && item.summaryText.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.sources.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: HistoryItem['type']) => {
    switch (type) {
      case 'question':
        return <MessageSquare className="h-4 w-4 text-primary-600 dark:text-primary-400" />;
      case 'summary':
        return <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case 'comparison':
        return <GitCompare className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'video_script':
        return <Video className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Compass className="h-4 w-4 text-sky-600 dark:text-sky-400" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-academic-900 dark:text-white flex items-center gap-2">
          <History className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <span>Research History & Audit Trail</span>
        </h2>
        <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
          Chronological record of research queries, structured summaries, multi-paper comparisons, and YouTube lecture extractions.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-academic-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search research history..."
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-academic-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['all', 'question', 'summary', 'comparison', 'youtube', 'video_script'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                typeFilter === type
                  ? 'bg-primary-600 text-white shadow-2xs'
                  : 'bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-300 hover:bg-academic-200'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* History Items Feed */}
      <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-academic-100 dark:divide-academic-800">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-academic-400 space-y-2">
            <History className="h-8 w-8 mx-auto opacity-40" />
            <p className="font-semibold text-sm">No research history matches your query</p>
            <p className="text-xs">Your inquiry activities and generated reports will appear here automatically.</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-5 hover:bg-academic-50/60 dark:hover:bg-academic-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-academic-100 dark:bg-academic-800">
                    {getTypeIcon(item.type)}
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold text-academic-400">
                    {item.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-academic-400">• {item.date}</span>
                </div>

                <h4 className="font-bold text-sm text-academic-900 dark:text-white group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h4>

                {item.summaryText && (
                  <p className="text-xs text-academic-600 dark:text-academic-300 line-clamp-2">
                    {item.summaryText}
                  </p>
                )}

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] font-semibold text-academic-400">Sources:</span>
                  {item.sources.map((src, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-academic-100 dark:bg-academic-800 text-[10px] font-mono text-academic-600 dark:text-academic-300"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => onToggleSaveHistory(item.id)}
                  title={item.saved ? 'Remove from Saved Research' : 'Save to Research Bookmarks'}
                  className="p-2 rounded-xl border border-academic-200 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-800 transition-colors"
                >
                  {item.saved ? (
                    <BookmarkCheck className="h-4 w-4 text-primary-600 fill-primary-600" />
                  ) : (
                    <Bookmark className="h-4 w-4 text-academic-400" />
                  )}
                </button>

                <button
                  onClick={() => onOpenHistoryItem(item)}
                  className="px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 hover:bg-primary-100 text-primary-700 dark:text-primary-300 font-semibold text-xs transition-colors flex items-center gap-1"
                >
                  <span>Open</span>
                  <ArrowRight className="h-3 w-3" />
                </button>

                <button
                  onClick={() => onDeleteHistory(item.id)}
                  title="Delete from History"
                  className="p-2 rounded-xl text-academic-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
