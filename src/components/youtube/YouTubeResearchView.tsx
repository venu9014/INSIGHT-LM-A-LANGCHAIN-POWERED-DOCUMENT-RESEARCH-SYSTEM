import React, { useState, useEffect } from 'react';
import {
  Youtube,
  Search,
  Sparkles,
  ExternalLink,
  Clock,
  BookOpen,
  FileText,
  Video,
  Download,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Play,
  GitCompare,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  YouTubeResearchResult,
  DocumentItem,
  DocumentVideoComparison,
  RecommendedVideo,
  ProjectVideoRecommendationResponse,
  ProjectVideoCategory,
  ProjectVideoItem
} from '../../types';
import { sampleYouTubeVideos } from '../../data/sampleData';
import { RAGService } from '../../services/ragService';

interface YouTubeResearchViewProps {
  documents: DocumentItem[];
  preSelectedVideo?: YouTubeResearchResult | null;
  onAskYouTube: (video: YouTubeResearchResult) => void;
  onCreateVideoFromYT: (video: YouTubeResearchResult) => void;
}

export const YouTubeResearchView: React.FC<YouTubeResearchViewProps> = ({
  documents,
  preSelectedVideo,
  onAskYouTube,
  onCreateVideoFromYT
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || 'doc-1');
  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  // Workflow Mode: Document-matched vs Project-based
  const [viewMode, setViewMode] = useState<'paper' | 'project'>('paper');
  const [projectData, setProjectData] = useState<ProjectVideoRecommendationResponse | null>(null);
  const [projectQuery, setProjectQuery] = useState('Full Stack AI Research Assistant (React, Flask, ChromaDB)');
  const [isLoadingProject, setIsLoadingProject] = useState(false);

  // Dynamically load videos corresponding to the currently chosen document!
  const [docVideos, setDocVideos] = useState<RecommendedVideo[]>([]);
  const [url, setUrl] = useState(preSelectedVideo?.url || 'https://www.youtube.com/watch?v=bj734wT27Gk');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<YouTubeResearchResult | null>(preSelectedVideo || sampleYouTubeVideos[0]);
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript' | 'topics' | 'beginner' | 'compare'>('summary');

  // Compare Document + Video State
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<DocumentVideoComparison | null>(null);

  const loadProjectVideos = async (q?: string) => {
    setIsLoadingProject(true);
    try {
      const data = await RAGService.fetchProjectVideoRecommendations(selectedDoc?.id, q || projectQuery);
      setProjectData(data);
    } catch (e) {
      console.warn('Failed to load project videos:', e);
    } finally {
      setIsLoadingProject(false);
    }
  };

  useEffect(() => {
    loadProjectVideos();
  }, [selectedDocId]);

  // Update related videos whenever the selected document changes
  useEffect(() => {
    if (selectedDoc) {
      // 1. Initial cached/pre-matched videos
      const initialVideos = RAGService.getVideosForDocument(selectedDoc);
      setDocVideos(initialVideos);
      if (initialVideos.length > 0 && !preSelectedVideo) {
        setUrl(initialVideos[0].url);
        handleAnalyze(initialVideos[0].url);
      }

      // 2. Query backend discovery endpoint for live YouTube discovery
      RAGService.discoverYouTubeVideos(selectedDoc.name, selectedDoc.id, documents).then((res) => {
        if (res && res.videos && res.videos.length > 0) {
          setDocVideos(res.videos);
        }
      }).catch((err) => {
        console.warn('Backend discovery notice:', err);
      });
    }
  }, [selectedDocId]);

  const handleAnalyze = async (targetUrl?: string) => {
    const toAnalyze = targetUrl || url;
    if (!toAnalyze.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await RAGService.analyzeYouTubeVideo(toAnalyze);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to process YouTube research video.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecommendedVideo = (rec: RecommendedVideo) => {
    setUrl(rec.url);
    handleAnalyze(rec.url);
  };

  const handleDownloadTranscript = () => {
    if (!result) return;
    const formatted = result.transcriptEntries
      .map((entry) => `[${entry.timestamp}] ${entry.text}`)
      .join('\n');
    const blob = new Blob([formatted], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${result.title.replace(/\s+/g, '_')}_Transcript.txt`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  };

  const handleCompareWithDocument = async () => {
    if (!result) return;
    const targetDoc = documents.find((d) => d.id === selectedDocId) || documents[0];
    if (!targetDoc) return;

    setIsComparing(true);
    setActiveTab('compare');
    try {
      const comp = await RAGService.compareDocumentAndVideo(targetDoc, result);
      setComparisonResult(comp);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Title & Purpose Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-academic-900 dark:text-white flex items-center gap-2">
            <Youtube className="h-6 w-6 text-red-600" />
            <span>Document-Based YouTube Video Synthesis</span>
          </h2>
          <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
            Videos are automatically matched with your uploaded research papers. Study video transcripts and compare them directly with paper equations.
          </p>
        </div>

        {/* Primary Document Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-academic-500">Target Paper:</span>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-700 text-xs font-semibold text-academic-900 dark:text-white shadow-2xs"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                📄 {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Mode Tabs: Document Lectures vs Project Architecture Recommendations */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-academic-200 dark:border-academic-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('paper')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'paper'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-academic-100 dark:bg-academic-800 text-academic-700 dark:text-academic-300'
            }`}
          >
            📄 Document-Matched Lectures ({docVideos.length})
          </button>
          <button
            onClick={() => {
              setViewMode('project');
              if (!projectData) loadProjectVideos();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'project'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-academic-100 dark:bg-academic-800 text-academic-700 dark:text-academic-300'
            }`}
          >
            🚀 Project Architecture & Tech Shelves ({projectData?.categories?.length || 6} Categories)
          </button>
        </div>

        {viewMode === 'project' && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={projectQuery}
              onChange={(e) => setProjectQuery(e.target.value)}
              placeholder="Project Topic / Tech Stack..."
              className="px-3 py-1.5 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs text-academic-900 dark:text-white w-64 focus:outline-none"
            />
            <button
              onClick={() => loadProjectVideos(projectQuery)}
              disabled={isLoadingProject}
              className="px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isLoadingProject ? 'Loading...' : 'Find Tutorials'}
            </button>
          </div>
        )}
      </div>

      {/* PROJECT-BASED TUTORIAL SHELVES */}
      {viewMode === 'project' && projectData && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-academic-900 to-primary-950 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase font-bold text-primary-300 tracking-wider">
                Full-Stack Architecture & Implementation Curriculum
              </span>
              <h3 className="text-lg font-bold mt-0.5">
                {projectData.project_title}
              </h3>
              <p className="text-xs text-academic-300 mt-1">
                Verified high-quality engineering tutorials covering system architecture, React + Flask integration, ChromaDB HNSW indexing, and automated QA testing.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 max-w-sm">
              {projectData.tech_stack?.map((tech) => (
                <span key={tech} className="px-2 py-0.5 rounded-md bg-academic-800 border border-academic-700 text-[10px] font-mono text-primary-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Render Each Category Shelf */}
          {projectData.categories.map((category) => (
            <div key={category.id} className="space-y-3">
              <div className="flex items-center justify-between border-b border-academic-100 dark:border-academic-800 pb-2">
                <div>
                  <h4 className="text-sm font-bold text-academic-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-red-500" />
                    <span>{category.title}</span>
                  </h4>
                  <p className="text-[11px] text-academic-500 dark:text-academic-400">
                    {category.description}
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-academic-400">
                  {category.videos.length} Lectures
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.videos.map((vid) => {
                  const isCurrent = url === vid.url;
                  const thumb = vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.videoId}/hqdefault.jpg`;

                  return (
                    <div
                      key={vid.id}
                      onClick={() => {
                        setUrl(vid.url);
                        handleAnalyze(vid.url);
                      }}
                      className={`rounded-2xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between group ${
                        isCurrent
                          ? 'bg-red-50/60 dark:bg-red-950/30 border-red-500 shadow-md ring-2 ring-red-400/20'
                          : 'bg-white dark:bg-academic-900 border-academic-200 dark:border-academic-800 hover:border-red-300 shadow-xs'
                      }`}
                    >
                      <div className="relative aspect-video w-full bg-academic-950 overflow-hidden">
                        <img
                          src={thumb}
                          alt={vid.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                          <div className="h-10 w-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <Play className="h-4 w-4 fill-current ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono font-semibold">
                          {vid.duration}
                        </span>
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-red-300 text-[10px] font-bold truncate max-w-[70%]">
                          {vid.channel}
                        </span>
                      </div>

                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h5 className="font-bold text-xs text-academic-900 dark:text-white line-clamp-2 leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                            {vid.title}
                          </h5>
                          <p className="text-[11px] text-academic-500 dark:text-academic-400 line-clamp-2 leading-relaxed mt-1.5">
                            {vid.relevanceExplanation}
                          </p>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-academic-100 dark:border-academic-800 text-[11px] font-semibold">
                          <span className={isCurrent ? 'text-red-600 dark:text-red-400 font-bold' : 'text-primary-600 dark:text-primary-400'}>
                            {isCurrent ? '● Active in Workspace' : '▶ Watch & Analyze'}
                          </span>
                          <a
                            href={vid.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-academic-400 hover:text-red-600 p-1 rounded hover:bg-academic-100 dark:hover:bg-academic-800"
                            title="Open on YouTube"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Automatically Discovered Video Shelf For Current Document (in paper mode) */}
      {viewMode === 'paper' && docVideos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Auto-Matched Learning Videos for "{selectedDoc?.name}"</span>
            </h4>
            <span className="text-[11px] text-academic-400 font-mono">
              Click any video to load & analyze
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {docVideos.map((video) => {
              const isCurrent = url === video.url;
              const thumbUrl = video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
              return (
                <div
                  key={video.id}
                  onClick={() => handleSelectRecommendedVideo(video)}
                  className={`rounded-2xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between group ${
                    isCurrent
                      ? 'bg-red-50/60 dark:bg-red-950/30 border-red-500 dark:border-red-600 shadow-md ring-2 ring-red-400/20'
                      : 'bg-white dark:bg-academic-900 border-academic-200 dark:border-academic-800 hover:border-red-300 dark:hover:border-red-800/60 shadow-xs'
                  }`}
                >
                  {/* Real Video Thumbnail */}
                  <div className="relative aspect-video w-full bg-academic-950 overflow-hidden">
                    <img
                      src={thumbUrl}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Play Badge */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="h-10 w-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="h-4 w-4 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono font-semibold">
                      {video.duration}
                    </span>

                    {/* Channel Tag */}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-red-300 text-[10px] font-bold truncate max-w-[70%]">
                      {video.channel}
                    </span>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-academic-900 dark:text-white line-clamp-2 leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {video.title}
                      </h5>

                      <p className="text-[11px] text-academic-500 dark:text-academic-400 line-clamp-2 leading-relaxed mt-1.5">
                        {video.relevanceExplanation}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-academic-100 dark:border-academic-800 text-[11px] font-semibold">
                      <span className={isCurrent ? 'text-red-600 dark:text-red-400 font-bold' : 'text-primary-600 dark:text-primary-400'}>
                        {isCurrent ? '● Active in Workspace' : '▶ Analyze Lecture'}
                      </span>
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-academic-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded hover:bg-academic-100 dark:hover:bg-academic-800 transition-colors"
                        title="Open Directly on YouTube"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual URL Bar (Optional Override) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-academic-500 block">
            Custom Video URL (Optional Override)
          </label>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Youtube className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://www.youtube.com/watch?v=..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-academic-900 dark:text-white placeholder-academic-400 focus:outline-none"
            />
          </div>
          <button
            onClick={() => handleAnalyze()}
            disabled={isLoading || !url.trim()}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isLoading ? 'Processing...' : 'Analyze'}</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Transcript Unavailable</p>
            <p className="text-red-700 dark:text-red-400 leading-relaxed">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Results View */}
      {result && !isLoading && (
        <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 select-text">
          {/* Video Metadata Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-academic-100 dark:border-academic-800 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold">
                  YouTube ID: {result.videoId}
                </span>
                <span className="text-xs text-academic-500 dark:text-academic-400">
                  Channel: {result.channel}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-academic-900 dark:text-white">
                {result.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-academic-400 font-mono pt-1">
                <span>Duration: {result.duration}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified Transcript Ingested ✓
                </span>
              </div>
            </div>

            {/* Action Buttons: Watch on YouTube + Compare With Document + Download */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={result.url || (result.videoId ? `https://www.youtube.com/watch?v=${result.videoId}` : 'https://www.youtube.com')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Watch on YouTube ↗</span>
              </a>

              <button
                onClick={handleCompareWithDocument}
                disabled={isComparing}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <GitCompare className="h-3.5 w-3.5" />
                <span>{isComparing ? 'Comparing...' : 'Compare With Document'}</span>
              </button>

              <button
                onClick={() => onAskYouTube(result)}
                className="px-3.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Ask Questions</span>
              </button>

              <button
                onClick={handleDownloadTranscript}
                className="px-3.5 py-2 rounded-xl bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 text-academic-800 dark:text-academic-200 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Transcript</span>
              </button>
            </div>
          </div>

          {/* Embedded Real YouTube Video Player */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-academic-800 shadow-xl">
            <iframe
              src={`https://www.youtube.com/embed/${result.videoId}?rel=0&autoplay=0`}
              title={result.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-academic-100 dark:border-academic-800 pb-2 text-xs flex-wrap">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'summary'
                  ? 'bg-primary-600 text-white'
                  : 'text-academic-600 dark:text-academic-400 hover:bg-academic-100'
              }`}
            >
              Research Summary
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'transcript'
                  ? 'bg-primary-600 text-white'
                  : 'text-academic-600 dark:text-academic-400 hover:bg-academic-100'
              }`}
            >
              Timestamped Transcript
            </button>
            <button
              onClick={() => setActiveTab('topics')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'topics'
                  ? 'bg-primary-600 text-white'
                  : 'text-academic-600 dark:text-academic-400 hover:bg-academic-100'
              }`}
            >
              Key Topics & Points
            </button>
            <button
              onClick={() => setActiveTab('beginner')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'beginner'
                  ? 'bg-primary-600 text-white'
                  : 'text-academic-600 dark:text-academic-400 hover:bg-academic-100'
              }`}
            >
              Beginner Explanation
            </button>
            <button
              onClick={() => {
                setActiveTab('compare');
                if (!comparisonResult) handleCompareWithDocument();
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'compare'
                  ? 'bg-amber-600 text-white'
                  : 'text-academic-600 dark:text-academic-400 hover:bg-academic-100'
              }`}
            >
              <GitCompare className="h-3.5 w-3.5" />
              <span>Document + Video Comparison</span>
            </button>
          </div>

          {/* Tab 1: Research Summary */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Video Research Abstract
                </h4>
                <p className="text-xs sm:text-sm text-academic-700 dark:text-academic-300 leading-relaxed font-serif">
                  {result.summary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-academic-50 dark:bg-academic-800/30 border border-academic-200/60 dark:border-academic-700/60 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-academic-800 dark:text-academic-200">
                    Important Scientific Points
                  </h4>
                  <ul className="space-y-1.5 text-xs text-academic-600 dark:text-academic-300">
                    {result.importantPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-bold text-primary-600">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-academic-50 dark:bg-academic-800/30 border border-academic-200/60 dark:border-academic-700/60 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-academic-800 dark:text-academic-200">
                    Extracted Topics
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.keyTopics.map((top, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-academic-200/70 dark:bg-academic-800 text-xs font-medium text-academic-700 dark:text-academic-300"
                      >
                        {top}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Transcript with Timestamps */}
          {activeTab === 'transcript' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-academic-500">
                <span>Verified Clean Transcript Excerpt</span>
                <span className="font-mono">{result.transcriptEntries.length} timestamp blocks</span>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {result.transcriptEntries.map((entry, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 flex items-start gap-3 text-xs"
                  >
                    <span className="px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-mono font-bold shrink-0">
                      {entry.timestamp}
                    </span>
                    <p className="text-academic-700 dark:text-academic-300 leading-relaxed font-sans">
                      {entry.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Key Topics */}
          {activeTab === 'topics' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.keyTopics.map((topic, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-academic-200 dark:border-academic-800 bg-academic-50/50 dark:bg-academic-800/30 text-xs"
                >
                  <p className="font-bold text-academic-900 dark:text-white mb-1">
                    {topic}
                  </p>
                  <p className="text-academic-500 dark:text-academic-400 text-[11px] leading-relaxed">
                    Identified in YouTube transcript and available for multi-modal vector search in ChromaDB.
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Beginner Explanation */}
          {activeTab === 'beginner' && (
            <div className="p-5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Intuitive Beginner Explanation
              </h4>
              <p className="text-xs sm:text-sm text-academic-800 dark:text-academic-200 leading-relaxed font-serif">
                {result.beginnerExplanation}
              </p>
            </div>
          )}

          {/* Tab 5: Document + Video Comparison */}
          {activeTab === 'compare' && (
            <div className="space-y-6">
              {comparisonResult && (
                <div className="space-y-4">
                  {/* Simplified Combined Explanation */}
                  <div className="p-4 rounded-xl bg-primary-50/60 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary-800 dark:text-primary-300 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary-600" />
                      <span>Unified Multi-Modal Synthesis</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-academic-800 dark:text-academic-200 leading-relaxed font-sans">
                      {comparisonResult.simplifiedExplanation}
                    </p>
                  </div>

                  {/* Common Concepts & Differences Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-academic-800 dark:text-academic-200 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Common Concepts</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-academic-600 dark:text-academic-300">
                        {comparisonResult.commonConcepts.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="font-bold text-primary-600">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-academic-800 dark:text-academic-200 flex items-center gap-1.5">
                        <GitCompare className="h-3.5 w-3.5 text-amber-500" />
                        <span>Key Differences (Clearly Tagged)</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-academic-700 dark:text-academic-300">
                        {comparisonResult.differences.map((diff, i) => (
                          <li key={i} className="p-2.5 rounded-lg bg-white dark:bg-academic-900 border border-academic-200/70 dark:border-academic-750">
                            {diff}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Additional Information & Misunderstandings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/60 dark:border-academic-700/60 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-academic-800 dark:text-academic-200 flex items-center gap-1.5">
                        <span className="text-red-500 font-bold">▶️</span>
                        <span>Additional Insights from Video</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-academic-600 dark:text-academic-300">
                        {comparisonResult.additionalInfoFromVideo.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="font-bold text-red-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                        <span>Possible Misunderstandings Resolved</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-academic-700 dark:text-academic-300">
                        {comparisonResult.possibleMisunderstandings.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="font-bold text-amber-600">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
