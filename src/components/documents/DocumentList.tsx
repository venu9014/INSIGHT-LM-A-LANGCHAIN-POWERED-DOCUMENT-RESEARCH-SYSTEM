import React, { useState, useTransition } from 'react';
import { Search, Filter, Plus, FileText, CheckCircle2, Trash2, Eye, MessageSquare, BookOpen, Clock, Tag } from 'lucide-react';
import { DocumentItem, DocumentType } from '../../types';

interface DocumentListProps {
  documents: DocumentItem[];
  onOpenUpload: () => void;
  onOpenDoc: (doc: DocumentItem) => void;
  onAskDoc: (doc: DocumentItem) => void;
  onSummarizeDoc: (doc: DocumentItem) => void;
  onDeleteDoc: (docId: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onOpenUpload,
  onOpenDoc,
  onAskDoc,
  onSummarizeDoc,
  onDeleteDoc
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<DocumentType>('All');
  const [, startTransition] = useTransition();

  const filteredDocs = documents.filter((doc) => {
    const matchesFilter = activeFilter === 'All' || doc.type === activeFilter;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.authors && doc.authors.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.tags && doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesFilter && matchesSearch;
  });

  const filterTabs: DocumentType[] = ['All', 'Research Papers', 'Notes', 'Reports'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-academic-900 dark:text-white">
            Research Documents
          </h2>
          <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
            Manage your indexed literature, inspect vector chunk counts, and execute targeted research workflows.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Upload Documents</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-academic-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => startTransition(() => setSearchQuery(e.target.value))}
            placeholder="Search documents, authors, tags..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-academic-900 dark:text-white placeholder-academic-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-academic-400 flex items-center gap-1 mr-1">
            <Filter className="h-3.5 w-3.5" />
            Filter:
          </span>
          {filterTabs.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === filter
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-300 hover:bg-academic-200 dark:hover:bg-academic-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Document Table / Cards */}
      <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-academic-200 dark:border-academic-800 bg-academic-50/70 dark:bg-academic-800/40 text-[11px] font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400">
                <th className="py-3.5 px-5">Document Name</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Pages & Chunks</th>
                <th className="py-3.5 px-4">Uploaded Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-academic-100 dark:divide-academic-800 text-xs">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-academic-400 dark:text-academic-500">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-sm">No research documents matched your criteria</p>
                    <p className="text-xs mt-1">Try clearing your search query or upload a new research PDF.</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-academic-50/60 dark:hover:bg-academic-800/40 transition-colors group"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-academic-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {doc.name}
                          </p>
                          {doc.authors && (
                            <p className="text-[11px] text-academic-500 dark:text-academic-400 truncate max-w-sm mt-0.5">
                              {doc.authors} {doc.year ? `(${doc.year})` : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-academic-600 dark:text-academic-300">
                      <span className="px-2.5 py-1 rounded-md bg-academic-100 dark:bg-academic-800 font-medium">
                        {doc.type}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-academic-600 dark:text-academic-300 font-mono">
                      <div>{doc.pages} pages</div>
                      <div className="text-[10px] text-academic-400">
                        {doc.chunksCount ? `${doc.chunksCount} chunks` : 'Indexed'}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-academic-500 dark:text-academic-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>{doc.uploadedAt}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        ✓ {doc.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onOpenDoc(doc)}
                          title="Open Document Preview"
                          className="p-1.5 rounded-lg text-academic-500 hover:text-academic-900 dark:text-academic-400 dark:hover:text-white hover:bg-academic-100 dark:hover:bg-academic-800 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onAskDoc(doc)}
                          title="Ask Research Assistant"
                          className="p-1.5 rounded-lg text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/60 transition-colors"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onSummarizeDoc(doc)}
                          title="Summarize Document"
                          className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteDoc(doc.id)}
                          title="Delete Document"
                          className="p-1.5 rounded-lg text-academic-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
