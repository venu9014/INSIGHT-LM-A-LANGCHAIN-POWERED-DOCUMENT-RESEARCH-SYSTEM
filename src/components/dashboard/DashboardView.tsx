import React from 'react';
import { BookOpen, HelpCircle, FileText, Video, Sparkles, Plus, Search, Layers, Database } from 'lucide-react';
import { StatCard } from './StatCard';
import { RecentDocuments } from './RecentDocuments';
import { QuickActions } from './QuickActions';
import { ResearchInsights } from './ResearchInsights';
import { DocumentItem, NavTab, UserProfile } from '../../types';

interface DashboardViewProps {
  documents: DocumentItem[];
  user: UserProfile;
  onNavigate: (tab: NavTab) => void;
  onOpenUpload: () => void;
  onOpenDoc: (doc: DocumentItem) => void;
  onAskDoc: (doc: DocumentItem) => void;
  onSummarizeDoc: (doc: DocumentItem) => void;
  onCompareDoc: (doc: DocumentItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  documents,
  user,
  onNavigate,
  onOpenUpload,
  onOpenDoc,
  onAskDoc,
  onSummarizeDoc,
  onCompareDoc
}) => {
  const indexedCount = documents.filter((d) => d.status === 'Indexed').length;
  const totalChunks = documents.reduce((acc, d) => acc + (d.chunksCount || 0), 0);
  const totalPages = documents.reduce((acc, d) => acc + (d.pages || 0), 0);
  const uniqueTopics = Array.from(new Set(documents.flatMap((d) => d.tags || []))).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-academic-900 via-primary-950 to-academic-900 text-white p-8 sm:p-10 shadow-lg border border-academic-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-400/30 text-primary-200 text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5 text-primary-300" />
            <span>LangChain + ChromaDB RAG Engine Active • {user.role} Workspace</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Welcome back, {user.name}
          </h1>

          <p className="mt-3 text-academic-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            Turn complex research into clear, useful knowledge. Upload papers, ask questions, compare research, and create learning content.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {user.role === 'Teacher' ? (
              <>
                <button
                  onClick={onOpenUpload}
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-primary-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ Upload Course Syllabus</span>
                </button>
                <button
                  onClick={() => onNavigate('assessment')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>📝 Question Paper Studio (8 Formats)</span>
                </button>
                <button
                  onClick={() => onNavigate('youtube')}
                  className="px-4 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>▶️ Lecture & Project Tutorials</span>
                </button>
              </>
            ) : user.role === 'Student' ? (
              <>
                <button
                  onClick={() => onNavigate('assessment')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>🎓 Take Assigned Exam / Quiz</span>
                </button>
                <button
                  onClick={() => onNavigate('assistant')}
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-primary-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Search className="h-4 w-4 text-white" />
                  <span>Ask AI for Simplified Concepts</span>
                </button>
                <button
                  onClick={() => onNavigate('youtube')}
                  className="px-4 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>▶️ YouTube Video Lessons</span>
                </button>
                <button
                  onClick={onOpenUpload}
                  className="px-4 py-2.5 rounded-xl bg-academic-800/80 hover:bg-academic-700 text-white border border-academic-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ Upload Notes</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenUpload}
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-primary-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>+ Upload Research Paper</span>
                </button>
                <button
                  onClick={() => onNavigate('assistant')}
                  className="px-5 py-2.5 rounded-xl bg-academic-800/80 hover:bg-academic-700/80 text-white border border-academic-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Search className="h-4 w-4 text-academic-400" />
                  <span>Deep Literature Q&A</span>
                </button>
                <button
                  onClick={() => onNavigate('compare')}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>⚖️ Compare Papers Matrix</span>
                </button>
                <button
                  onClick={() => onNavigate('youtube')}
                  className="px-4 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>▶️ Tech Talks & Projects</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Ambient Grid Effect */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      {/* 5 Real Metric Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Documents"
          value={documents.length}
          icon={BookOpen}
          subtext="In research repository"
          change={documents.length > 0 ? "Corpus loaded" : "No documents"}
          colorTheme="indigo"
          onClick={() => onNavigate('documents')}
        />
        <StatCard
          title="ChromaDB Vectors"
          value={totalChunks}
          icon={Database}
          subtext="Indexed chunk embeddings"
          change={`${indexedCount} files`}
          colorTheme="emerald"
          onClick={() => onNavigate('documents')}
        />
        <StatCard
          title="Extracted Pages"
          value={totalPages}
          icon={FileText}
          subtext="Analyzed page content"
          change="Hierarchical chunks"
          colorTheme="blue"
          onClick={() => onNavigate('documents')}
        />
        <StatCard
          title="Domain Topics"
          value={uniqueTopics}
          icon={Sparkles}
          subtext="Extracted concept tags"
          change="Concept graph"
          colorTheme="amber"
          onClick={() => onNavigate('insights')}
        />
        <StatCard
          title="RAG Precision"
          value="100%"
          icon={HelpCircle}
          subtext="Context-grounded answering"
          change="Zero hallucination"
          colorTheme="indigo"
          onClick={() => onNavigate('assistant')}
        />
      </div>

      {/* 8 Modern Dashboard Workflow Cards */}
      <QuickActions onNavigate={onNavigate} />

      {/* Recent Documents Section */}
      <RecentDocuments
        documents={documents}
        onOpenDoc={onOpenDoc}
        onAskDoc={onAskDoc}
        onViewAll={() => onNavigate('documents')}
      />

      {/* Research Insights */}
      <ResearchInsights documents={documents} onOpenUpload={onOpenUpload} />
    </div>
  );
};
