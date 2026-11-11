import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Copy,
  RotateCcw,
  BookOpen,
  Youtube,
  Bookmark,
  BookmarkCheck,
  Check,
  ExternalLink,
  Info,
  Sliders,
  Play,
  Globe,
  HelpCircle,
  Brain,
  GraduationCap,
  School,
  Microscope,
  Compass,
  AlertCircle,
  Lightbulb,
  FileText
} from 'lucide-react';
import {
  ChatMessage,
  DocumentItem,
  ResearchSource,
  UserRole,
  RecommendedVideo,
  YouTubeResearchResult
} from '../../types';
import { SourceCard } from './SourceCard';
import { SourceViewerModal } from './SourceViewerModal';
import { RAGService } from '../../services/ragService';

interface ResearchAssistantProps {
  documents: DocumentItem[];
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  userRole: UserRole;
  onSaveToBookmarks: (item: { title: string; subtitle?: string; content: string; source: string; type: 'answer' | 'passage' }) => void;
  onAnalyzeRecommendedVideo?: (video: RecommendedVideo) => void;
}

export const ResearchAssistant: React.FC<ResearchAssistantProps> = ({
  documents,
  chatHistory,
  setChatHistory,
  userRole,
  onSaveToBookmarks,
  onAnalyzeRecommendedVideo
}) => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>(
    documents.slice(0, 3).map((d) => d.id)
  );
  const [depthMode, setDepthMode] = useState<'Brief' | 'Detailed' | 'Deep Research'>('Detailed');
  const [activeRole, setActiveRole] = useState<UserRole>(userRole);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSourceForModal, setSelectedSourceForModal] = useState<ResearchSource | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync role when user switches persona
  useEffect(() => {
    setActiveRole(userRole);
  }, [userRole]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const toggleDocSelection = (id: string) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((d) => d !== id) : prev) : [...prev, id]
    );
  };

  const handleAsk = async (questionText?: string, overrideRole?: UserRole) => {
    const q = questionText || inputQuestion;
    if (!q.trim() || isLoading) return;

    const roleToUse = overrideRole || activeRole;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const assistantMessage = await RAGService.askResearchQuestion(
        q,
        selectedDocIds,
        documents,
        [],
        depthMode,
        roleToUse
      );
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainSimpler = async (msgId: string, currentContent: string) => {
    setIsActionLoading(`${msgId}-simpler`);
    try {
      const simplerText = await RAGService.explainSimpler(currentContent);
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === msgId ? { ...msg, content: msg.content + '\n\n' + simplerText } : msg
        )
      );
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleGoDeeper = async (msgId: string, currentContent: string) => {
    setIsActionLoading(`${msgId}-deeper`);
    try {
      const deeperText = await RAGService.goDeeper(currentContent);
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === msgId ? { ...msg, content: msg.content + '\n\n' + deeperText } : msg
        )
      );
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleGiveExample = async (msgId: string, currentContent: string) => {
    setIsActionLoading(`${msgId}-example`);
    try {
      const example = await RAGService.giveExample(currentContent);
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.id === msgId ? { ...msg, illustrativeExample: example } : msg
        )
      );
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveAnswer = (msg: ChatMessage) => {
    onSaveToBookmarks({
      title: `Grounded Research Synthesis (${msg.explanationRole || activeRole})`,
      subtitle: `Model: ${msg.metrics?.model || 'LangChain RAG'} • ${msg.metrics?.depthMode || 'Detailed'} Mode`,
      content: msg.content,
      source: msg.sources?.map((s) => s.documentName).join(', ') || 'Selected literature',
      type: 'answer'
    });

    setChatHistory((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, saved: true } : m))
    );
  };

  const samplePrompts = [
    'What is the methodology used in this paper?',
    'Explain how attention works in transformers.',
    'What are the main limitations and empirical results?',
    'What research gaps exist in the current literature?'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-academic-50/50 dark:bg-academic-950/40 select-none">
      {/* Top Header & Document-Centric Controls */}
      <div className="p-5 border-b border-academic-200/80 dark:border-academic-800 bg-white/90 dark:bg-academic-900/90 backdrop-blur-xs">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-academic-900 dark:text-white flex items-center gap-2">
                <span>Research Assistant</span>
              </h2>
              <p className="text-xs text-academic-500 dark:text-academic-400">
                Document-centric grounded inquiry across indexed papers with automated YouTube learning discovery.
              </p>
            </div>

            {/* Role-Specific Adaptive Toggle & Depth Selector */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Explain this for: [Student / Teacher / Researcher] */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-academic-100 dark:bg-academic-800 border border-academic-200/70 dark:border-academic-700/60 text-xs">
                <span className="text-[11px] font-bold text-academic-500 px-2 flex items-center gap-1">
                  Explain for:
                </span>
                {(['Student', 'Teacher', 'Researcher'] as UserRole[]).map((r) => {
                  const isCur = activeRole === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setActiveRole(r)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                        isCur
                          ? 'bg-primary-600 text-white shadow-2xs'
                          : 'text-academic-600 dark:text-academic-400 hover:bg-academic-200 dark:hover:bg-academic-700'
                      }`}
                    >
                      {r === 'Student' && <GraduationCap className="h-3 w-3" />}
                      {r === 'Teacher' && <School className="h-3 w-3" />}
                      {r === 'Researcher' && <Microscope className="h-3 w-3" />}
                      <span>{r}</span>
                    </button>
                  );
                })}
              </div>

              {/* Depth Selector: Brief (150-250w), Detailed (400-700w), Deep Research (800-1200w) */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-academic-100 dark:bg-academic-800 border border-academic-200/70 dark:border-academic-700/60 text-xs">
                <span className="text-[11px] font-semibold text-academic-500 px-2 flex items-center gap-1">
                  <Sliders className="h-3 w-3" />
                  Depth:
                </span>
                {(['Brief', 'Detailed', 'Deep Research'] as const).map((dm) => (
                  <button
                    key={dm}
                    onClick={() => setDepthMode(dm)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      depthMode === dm
                        ? 'bg-primary-600 text-white shadow-2xs'
                        : 'text-academic-600 dark:text-academic-400 hover:bg-academic-200 dark:hover:bg-academic-700'
                    }`}
                  >
                    {dm}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Source Document Selector Chips */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-semibold text-academic-500 dark:text-academic-400 shrink-0 flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Primary Document(s):</span>
              </span>

              <div className="flex items-center gap-1.5 flex-wrap">
                {documents.map((doc) => {
                  const isSelected = selectedDocIds.includes(doc.id);
                  return (
                    <button
                      key={doc.id}
                      onClick={() => toggleDocSelection(doc.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isSelected
                          ? 'bg-primary-50 dark:bg-primary-950 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300 font-semibold shadow-2xs'
                          : 'bg-white dark:bg-academic-800 border-academic-200 dark:border-academic-700 text-academic-600 dark:text-academic-400 hover:bg-academic-100'
                      }`}
                    >
                      <span>📄</span>
                      <span className="truncate max-w-[150px]">{doc.name}</span>
                      {isSelected && <span className="text-[10px] font-bold text-primary-600">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar select-text">
        <div className="max-w-4xl mx-auto space-y-6">
          {chatHistory.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-academic-900 dark:text-white">
                  Document-Centric Research Assistant Active
                </h3>
                <p className="text-xs text-academic-500 dark:text-academic-400 mt-1 max-w-md mx-auto">
                  Ask questions about your uploaded documents. The system retrieves verified paragraphs in ChromaDB, explains concepts for <strong>{activeRole}</strong>, and automatically recommends relevant educational YouTube videos.
                </p>
              </div>

              {/* Sample Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl mx-auto pt-4 text-left">
                {samplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleAsk(prompt)}
                    className="p-3 rounded-xl bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-800 hover:border-primary-400 text-xs text-academic-700 dark:text-academic-300 transition-all hover:shadow-sm flex items-center justify-between group"
                  >
                    <span className="line-clamp-2">{prompt}</span>
                    <Sparkles className="h-3.5 w-3.5 text-academic-400 group-hover:text-primary-600 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.role === 'user' ? (
                  <div className="max-w-2xl bg-academic-800 text-white rounded-2xl rounded-br-xs px-5 py-3.5 text-xs sm:text-sm shadow-sm">
                    <p>{msg.content}</p>
                    <span className="block text-[10px] text-academic-400 text-right mt-1.5 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                ) : (
                  <div className="w-full bg-white dark:bg-academic-900 border border-academic-200/90 dark:border-academic-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                    {/* Grounding & Persona Status Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-academic-100 dark:border-academic-800 gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/80">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>✓ Answer grounded in selected research sources</span>
                        </div>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-semibold">
                          Explained for: {msg.explanationRole || activeRole}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-400">
                          Depth: {msg.metrics?.depthMode || depthMode}
                        </span>
                      </div>

                      {msg.metrics && (
                        <div className="flex items-center gap-2.5 text-[11px] text-academic-400 font-mono">
                          <span>{msg.metrics.retrievalTimeMs}ms retrieval</span>
                          <span>•</span>
                          <span>{msg.metrics.tokensCount} tokens</span>
                        </div>
                      )}
                    </div>

                    {/* Rich Formatted Answer Content */}
                    <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm text-academic-800 dark:text-academic-200 leading-relaxed whitespace-pre-line font-sans space-y-3">
                      {msg.content}
                    </div>

                    {/* AI Illustrative Example (Requirement 6: Clearly distinguished from paper) */}
                    {msg.illustrativeExample && (
                      <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                            <Lightbulb className="h-3.5 w-3.5 text-sky-600" />
                            <span>{msg.illustrativeExample.title}</span>
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 font-semibold">
                            AI Synthesis (Not from Paper)
                          </span>
                        </div>
                        <p className="text-xs text-academic-800 dark:text-academic-200 leading-relaxed font-sans">
                          {msg.illustrativeExample.explanation}
                        </p>
                      </div>
                    )}

                    {/* Difficult Technical Terms Explanation (Requirement 7) */}
                    {msg.technicalTerms && msg.technicalTerms.length > 0 && (
                      <div className="p-4 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-primary-500" />
                          <span>Important Technical Terms Defined</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {msg.technicalTerms.map((term, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-750 text-xs">
                              <span className="font-bold text-primary-700 dark:text-primary-300 block mb-0.5">
                                {term.term}
                              </span>
                              <p className="text-[11px] text-academic-600 dark:text-academic-300 leading-relaxed">
                                {term.meaning}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Role Specific Extras: Student Notes or Teacher Classroom Activity or Researcher Benchmarks */}
                    {msg.studentExtras && (
                      <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Student Quick Revision & Practice</span>
                        </h4>
                        <div className="space-y-1 text-xs text-academic-700 dark:text-academic-300">
                          <p className="font-semibold text-emerald-900 dark:text-emerald-200">Exam-Oriented Takeaways:</p>
                          <ul className="list-disc pl-5 space-y-0.5">
                            {msg.studentExtras.examOrientedPoints.map((pt, i) => (
                              <li key={i}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {msg.teacherExtras && (
                      <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-900/50 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                          <School className="h-3.5 w-3.5 text-indigo-600" />
                          <span>Teacher Pedagogical Kit</span>
                        </h4>
                        <p className="text-xs text-academic-700 dark:text-academic-300">
                          <strong>Classroom Activity:</strong> {msg.teacherExtras.classroomActivity}
                        </p>
                      </div>
                    )}

                    {msg.researcherExtras && (
                      <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-900/50 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                          <Microscope className="h-3.5 w-3.5 text-purple-600" />
                          <span>Researcher Gaps & Thesis Directions</span>
                        </h4>
                        <ul className="list-disc pl-5 space-y-0.5 text-xs text-academic-700 dark:text-academic-300">
                          {msg.researcherExtras.potentialResearchGaps.map((gap, i) => (
                            <li key={i}>{gap}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Sources Used (Requirement 8) */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="pt-4 border-t border-academic-100 dark:border-academic-800">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>Sources Used ({msg.sources.length} Evidentiary Excerpts)</span>
                          </h4>
                          <span className="text-[11px] text-academic-400 font-mono">
                            Verified against ChromaDB
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {msg.sources.map((src, i) => (
                            <SourceCard
                              key={i}
                              source={src}
                              onOpenSourceModal={(s) => setSelectedSourceForModal(s)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AUTOMATIC RECOMMENDED YOUTUBE VIDEOS (Requirement 10-16) */}
                    {msg.recommendedVideos && msg.recommendedVideos.length > 0 && (
                      <div className="pt-4 border-t border-academic-100 dark:border-academic-800 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                            <Youtube className="h-4 w-4" />
                            <span>🎥 Recommended Learning Videos (Auto-Discovered for this Document)</span>
                          </h4>
                          <span className="text-[11px] text-academic-400 font-mono">
                            Real verified YouTube lectures
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {msg.recommendedVideos.map((video) => (
                            <div
                              key={video.id}
                              className="p-3 rounded-xl border border-academic-200 dark:border-academic-800 bg-academic-50/70 dark:bg-academic-800/40 hover:bg-white dark:hover:bg-academic-800 flex flex-col justify-between space-y-2.5 transition-all shadow-2xs"
                            >
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-mono text-academic-400 mb-1">
                                  <span>{video.channel}</span>
                                  <span>{video.duration}</span>
                                </div>
                                <h5 className="font-bold text-xs text-academic-900 dark:text-white line-clamp-2">
                                  {video.title}
                                </h5>
                                <p className="text-[11px] text-academic-500 dark:text-academic-400 mt-1 line-clamp-2 leading-relaxed">
                                  <strong>Why it is useful:</strong> {video.relevanceExplanation}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 pt-1 border-t border-academic-100 dark:border-academic-700/60">
                                <a
                                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className="flex-1 py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-[11px] transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                                >
                                  <Play className="h-3 w-3 fill-current" />
                                  <span>▶ Watch on YouTube</span>
                                </a>

                                {onAnalyzeRecommendedVideo && (
                                  <button
                                    onClick={() => onAnalyzeRecommendedVideo(video)}
                                    className="py-1.5 px-2.5 rounded-lg border border-academic-200 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-700 text-[11px] font-semibold text-academic-700 dark:text-academic-200 transition-colors cursor-pointer"
                                    title="Extract transcript and compare with research paper"
                                  >
                                    Analyze Video
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CONTINUE LEARNING RESOURCES (Requirement 17) */}
                    {msg.continueLearning && msg.continueLearning.length > 0 && (
                      <div className="pt-4 border-t border-academic-100 dark:border-academic-800 space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
                          <Compass className="h-4 w-4" />
                          <span>Continue Learning (Official Papers & Documentation)</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {msg.continueLearning.map((res, i) => (
                            <a
                              key={i}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-3 rounded-xl border border-academic-200 dark:border-academic-800 bg-academic-50/50 dark:bg-academic-800/30 hover:border-primary-400 transition-all block group"
                            >
                              <div className="flex items-center justify-between text-[10px] font-mono text-primary-600 dark:text-primary-400">
                                <span>{res.domain}</span>
                                <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                              </div>
                              <h5 className="font-bold text-xs text-academic-900 dark:text-white line-clamp-2 mt-1">
                                {res.title}
                              </h5>
                              <p className="text-[10px] text-academic-500 mt-1 line-clamp-2">
                                {res.description}
                              </p>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Adaptive Interactive Action Controls: Explain Simpler, Give Example, Go Deeper */}
                    <div className="pt-4 border-t border-academic-100 dark:border-academic-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      {/* Left: 3 Cognitive Tuning Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleExplainSimpler(msg.id, msg.content)}
                          disabled={isActionLoading !== null}
                          className="px-3 py-1.5 rounded-lg border border-academic-200 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-800 text-academic-700 dark:text-academic-300 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Brain className="h-3.5 w-3.5 text-primary-600" />
                          <span>{isActionLoading === `${msg.id}-simpler` ? 'Rewriting...' : '🧠 Explain Simpler'}</span>
                        </button>

                        <button
                          onClick={() => handleGiveExample(msg.id, msg.content)}
                          disabled={isActionLoading !== null}
                          className="px-3 py-1.5 rounded-lg border border-academic-200 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-800 text-academic-700 dark:text-academic-300 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Globe className="h-3.5 w-3.5 text-emerald-600" />
                          <span>{isActionLoading === `${msg.id}-example` ? 'Synthesizing...' : '🌍 Give Me an Example'}</span>
                        </button>

                        <button
                          onClick={() => handleGoDeeper(msg.id, msg.content)}
                          disabled={isActionLoading !== null}
                          className="px-3 py-1.5 rounded-lg border border-academic-200 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-800 text-academic-700 dark:text-academic-300 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Microscope className="h-3.5 w-3.5 text-purple-600" />
                          <span>{isActionLoading === `${msg.id}-deeper` ? 'Analyzing...' : '🔬 Go Deeper'}</span>
                        </button>
                      </div>

                      {/* Right: Copy, Regenerate & Save to Bookmarks */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="px-3 py-1.5 rounded-lg border border-academic-200 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-800 text-academic-700 dark:text-academic-300 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedId === msg.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedId === msg.id ? 'Copied!' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => {
                            const lastUser = [...chatHistory].reverse().find((m) => m.role === 'user');
                            if (lastUser) handleAsk(lastUser.content);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-academic-200 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-800 text-academic-700 dark:text-academic-300 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Regenerate</span>
                        </button>

                        <button
                          onClick={() => handleSaveAnswer(msg)}
                          className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                            msg.saved
                              ? 'bg-primary-50 dark:bg-primary-950 border-primary-300 text-primary-700 dark:text-primary-300'
                              : 'border-academic-200 dark:border-academic-700 hover:bg-academic-100 text-academic-700 dark:text-academic-300'
                          }`}
                        >
                          {msg.saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                          <span>{msg.saved ? 'Saved' : 'Save Answer'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="w-full bg-white dark:bg-academic-900 border border-academic-200/90 dark:border-academic-800 rounded-2xl p-6 shadow-sm space-y-4 animate-pulse">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary-600 dark:text-primary-400">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>
                  Querying ChromaDB vector database with LangChain for {activeRole} ({depthMode} Mode)...
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="h-3.5 bg-academic-200 dark:bg-academic-800 rounded-full w-3/4"></div>
                <div className="h-3.5 bg-academic-200 dark:bg-academic-800 rounded-full w-full"></div>
                <div className="h-3.5 bg-academic-200 dark:bg-academic-800 rounded-full w-5/6"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-academic-200/80 dark:border-academic-800 bg-white dark:bg-academic-900">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="flex items-center gap-2 bg-academic-50 dark:bg-academic-800/80 p-2 rounded-2xl border border-academic-200 dark:border-academic-700 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all shadow-inner"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder={`Ask a research question about the document (explained for ${activeRole})...`}
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent border-none outline-none text-academic-900 dark:text-white placeholder-academic-400"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>➤ Ask Research Assistant</span>
            </button>
          </form>
          <p className="text-[11px] text-academic-400 text-center mt-2 flex items-center justify-center gap-1">
            <Info className="h-3 w-3" />
            <span>
              Document-Centric Grounding in {selectedDocIds.length} paper(s) via LangChain + ChromaDB.
            </span>
          </p>
        </div>
      </div>

      {/* Source Excerpt Modal */}
      <SourceViewerModal
        source={selectedSourceForModal}
        onClose={() => setSelectedSourceForModal(null)}
      />
    </div>
  );
};
