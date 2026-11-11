import React from 'react';
import { FileText, Eye, MessageSquare, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { DocumentItem } from '../../types';

interface RecentDocumentsProps {
  documents: DocumentItem[];
  onOpenDoc: (doc: DocumentItem) => void;
  onAskDoc: (doc: DocumentItem) => void;
  onViewAll: () => void;
}

export const RecentDocuments: React.FC<RecentDocumentsProps> = ({
  documents,
  onOpenDoc,
  onAskDoc,
  onViewAll,
}) => {
  return (
    <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-academic-900 dark:text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            Recent Documents
          </h3>
          <p className="text-xs text-academic-500 dark:text-academic-400">
            Recently indexed papers available for semantic querying and comparative synthesis.
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center gap-1 hover:underline"
        >
          View Library <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {documents.slice(0, 3).map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-xl border border-academic-200 dark:border-academic-800/90 bg-academic-50/50 dark:bg-academic-800/30 hover:bg-white dark:hover:bg-academic-800/80 transition-all duration-200 flex flex-col justify-between group hover:shadow-md hover:border-academic-300 dark:hover:border-academic-700"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-lg bg-primary-100/70 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {doc.status}
                </span>
              </div>

              <h4 className="font-semibold text-sm text-academic-900 dark:text-white mt-3 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {doc.name}
              </h4>

              <div className="mt-2 space-y-1 text-xs text-academic-500 dark:text-academic-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  <span>Uploaded {doc.uploadedAt}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{doc.pages} pages</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-academic-200/60 dark:border-academic-700/60 flex items-center gap-2">
              <button
                onClick={() => onOpenDoc(doc)}
                className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-white dark:bg-academic-700 border border-academic-200 dark:border-academic-600 hover:bg-academic-100 dark:hover:bg-academic-600 text-academic-800 dark:text-academic-200 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Eye className="h-3.5 w-3.5 text-academic-500" />
                Open
              </button>
              <button
                onClick={() => onAskDoc(doc)}
                className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Ask Questions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
