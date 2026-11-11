import React from 'react';
import {
  BookOpen,
  MessageSquareQuote,
  FileText,
  GitCompare,
  Youtube,
  Video,
  BookmarkCheck,
  Bookmark,
  ArrowUpRight
} from 'lucide-react';
import { NavTab } from '../../types';

interface QuickActionsProps {
  onNavigate: (tab: NavTab) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const actions = [
    {
      label: '📚 My Research',
      description: 'Manage indexed papers, inspect vector chunk distributions, and manage files.',
      tab: 'documents' as NavTab,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      label: '🔍 Ask Research Assistant',
      description: 'Interact with grounded semantic retrieval across papers and YouTube lectures.',
      tab: 'assistant' as NavTab,
      color: 'from-indigo-600 to-primary-700',
    },
    {
      label: '📝 Summarize',
      description: 'Generate 6-mode structured summaries, executive abstracts, and methodologies.',
      tab: 'summarizer' as NavTab,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      label: '📊 Compare Papers',
      description: 'Synthesize a 10-dimensional comparative matrix across 2–5 research papers.',
      tab: 'compare' as NavTab,
      color: 'from-amber-600 to-orange-600',
    },
    {
      label: '▶️ YouTube Research',
      description: 'Ingest video lectures, extract timestamped transcripts, and study concepts.',
      tab: 'youtube' as NavTab,
      color: 'from-red-600 to-rose-600',
    },
    {
      label: '🎬 Learning Video',
      description: 'Create 5-scene educational video scripts with TTS narration and video player.',
      tab: 'video' as NavTab,
      color: 'from-purple-600 to-pink-600',
    },
    {
      label: '📑 Citations',
      description: 'Generate standardized IEEE, APA, MLA, and BibTeX citations & bibliographies.',
      tab: 'citations' as NavTab,
      color: 'from-teal-600 to-cyan-600',
    },
    {
      label: '⭐ Saved Research',
      description: 'Review pinned literature passages, verified answers, and research bookmarks.',
      tab: 'bookmarks' as NavTab,
      color: 'from-sky-600 to-blue-700',
    },
  ];

  return (
    <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-academic-900 dark:text-white">
          Modern Research Workflows
        </h3>
        <p className="text-xs text-academic-500 dark:text-academic-400">
          Jump directly into high-impact academic research and learning operations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => onNavigate(action.tab)}
            className="p-4 rounded-xl border border-academic-200 dark:border-academic-800 bg-academic-50/60 dark:bg-academic-800/40 hover:bg-white dark:hover:bg-academic-800/80 transition-all text-left group hover:shadow-md hover:border-academic-300 dark:hover:border-academic-700 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-academic-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {action.label}
                </span>
                <ArrowUpRight className="h-4 w-4 text-academic-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </div>
              <p className="text-xs text-academic-500 dark:text-academic-400 mt-2 line-clamp-2 leading-relaxed">
                {action.description}
              </p>
            </div>

            <div className="mt-3 pt-2 text-[11px] font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1">
              <span>Launch Workflow</span> →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
