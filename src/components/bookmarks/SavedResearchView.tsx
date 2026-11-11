import React, { useState } from 'react';
import { Bookmark, Search, Trash2, Copy, ExternalLink, FileText, MessageSquare, BookOpen, Check } from 'lucide-react';
import { SavedItem } from '../../types';

interface SavedResearchViewProps {
  savedItems: SavedItem[];
  onRemoveSaved: (id: string) => void;
}

export const SavedResearchView: React.FC<SavedResearchViewProps> = ({
  savedItems,
  onRemoveSaved
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = savedItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-academic-900 dark:text-white flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-primary-600 dark:text-primary-400 fill-primary-600" />
          <span>My Saved Research & Bookmarks Vault</span>
        </h2>
        <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
          Pinned literature passages, verified answers, model architectures, and cited paper snippets.
        </p>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-academic-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved research items..."
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-academic-900 dark:text-white focus:outline-none"
          />
        </div>
        <span className="text-xs font-mono text-academic-400">
          {savedItems.length} Pinned Items
        </span>
      </div>

      {/* Grid of Saved Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-academic-400 bg-white dark:bg-academic-900 rounded-2xl border border-academic-200 dark:border-academic-800">
            <Bookmark className="h-8 w-8 mx-auto opacity-30 mb-2" />
            <p className="font-semibold text-sm">No saved research items found</p>
            <p className="text-xs mt-1">Click "Save" or the bookmark icon on any answer or summary to pin it here.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-academic-400 mb-1">
                  <span className="font-mono uppercase font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950 px-2 py-0.5 rounded">
                    {item.type}
                  </span>
                  <span>Saved {item.savedAt}</span>
                </div>

                <h3 className="font-bold text-sm text-academic-900 dark:text-white mt-2">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs text-academic-500 dark:text-academic-400 font-medium">
                    {item.subtitle}
                  </p>
                )}

                <p className="text-xs text-academic-700 dark:text-academic-300 bg-academic-50 dark:bg-academic-800/40 p-3 rounded-xl border border-academic-200/60 dark:border-academic-700/60 mt-3 font-serif leading-relaxed line-clamp-4">
                  "{item.content}"
                </p>

                <p className="text-[11px] text-academic-400 font-mono mt-2 truncate">
                  Source: {item.source}
                </p>
              </div>

              <div className="pt-3 border-t border-academic-100 dark:border-academic-800 flex items-center justify-between">
                <button
                  onClick={() => handleCopy(item.content, item.id)}
                  className="px-3 py-1.5 rounded-lg border border-academic-200 dark:border-academic-700 hover:bg-academic-100 text-xs font-semibold text-academic-700 dark:text-academic-300 transition-colors flex items-center gap-1.5"
                >
                  {copiedId === item.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedId === item.id ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={() => onRemoveSaved(item.id)}
                  className="p-1.5 rounded-lg text-academic-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove from Saved"
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
