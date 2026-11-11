import React, { useState } from 'react';
import {
  Video,
  Sparkles,
  CheckCircle2,
  Loader2,
  Play,
  Download,
  FileText,
  ChevronDown,
  Edit3,
  Check,
  RotateCcw,
  BookOpen,
  Volume2
} from 'lucide-react';
import { DocumentItem, LearningVideoProject, VideoScene, UserRole } from '../../types';
import { sampleVideoProject } from '../../data/sampleData';
import { InteractiveVideoPlayer } from './InteractiveVideoPlayer';
import { RAGService } from '../../services/ragService';

interface VideoGeneratorProps {
  documents: DocumentItem[];
  userRole?: UserRole;
  onSaveToBookmarks: (item: { title: string; subtitle?: string; content: string; source: string; type: 'script' }) => void;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({
  documents,
  userRole = 'Student',
  onSaveToBookmarks
}) => {
  const [sourceType, setSourceType] = useState<'document' | 'youtube' | 'multi_docs' | 'topic'>('document');
  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || 'doc-1');
  const [topic, setTopic] = useState('Explain Retrieval-Augmented Generation');
  const [duration, setDuration] = useState<'60 seconds' | '2 minutes' | '3 minutes' | '5 minutes'>('2 minutes');
  const [audience, setAudience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [targetRole, setTargetRole] = useState<UserRole>(userRole);
  const [style, setStyle] = useState<'Animated Educational' | 'Technical Explainer' | 'Whiteboard' | 'Presentation'>('Animated Educational');

  // Pipeline execution states
  const [isGenerating, setIsGenerating] = useState(false);
  const [project, setProject] = useState<LearningVideoProject | null>(sampleVideoProject);
  const [expandedScene, setExpandedScene] = useState<number | null>(1);
  const [editingSceneNum, setEditingSceneNum] = useState<number | null>(null);
  const [editedNarration, setEditedNarration] = useState('');

  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    const activeTopic = sourceType === 'document'
      ? `Explain ${documents.find((d) => d.id === selectedDocId)?.name.replace('.pdf', '').replace(/_/g, ' ') || 'Research Topic'}`
      : topic;

    try {
      const newProject = await RAGService.generateVideoScript(
        activeTopic,
        duration,
        audience,
        style,
        sourceType,
        selectedDocId
      );
      setProject(newProject);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartSceneEdit = (scene: VideoScene) => {
    setEditingSceneNum(scene.sceneNumber);
    setEditedNarration(scene.narrationScript);
  };

  const handleSaveSceneEdit = (sceneNumber: number) => {
    if (!project) return;
    setProject({
      ...project,
      scenes: project.scenes.map((s) =>
        s.sceneNumber === sceneNumber ? { ...s, narrationScript: editedNarration } : s
      )
    });
    setEditingSceneNum(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-academic-900 dark:text-white flex items-center gap-2">
          <Video className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          <span>AI Learning Video Studio</span>
        </h2>
        <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
          Transform any research document into a synchronized interactive educational video with voiceover narration powered by the Web Speech API and dynamic visual animations.
        </p>
        <div className="mt-3 p-3 rounded-xl bg-primary-50/70 dark:bg-primary-950/40 border border-primary-200/60 dark:border-primary-800/50 flex items-center justify-between text-xs text-academic-700 dark:text-academic-300">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-600 shrink-0" />
            <span><strong>Video Studio vs Discovery:</strong> This studio creates multi-scene interactive scripts & TTS narration from your papers. For published lectures (Stanford CS224N, 3Blue1Brown, etc.), use the <strong>YouTube Research</strong> tab.</span>
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary-200/60 dark:bg-primary-800 text-primary-800 dark:text-primary-200 shrink-0">
            Web Speech TTS
          </span>
        </div>
      </div>

      {/* Configuration Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-6">
        {/* Source Mode Selector */}
        <div className="flex flex-wrap items-center gap-6 border-b border-academic-100 dark:border-academic-800 pb-4 text-xs font-semibold">
          <span className="text-academic-400 uppercase tracking-wider font-bold">Source Content:</span>
          {[
            { id: 'document' as const, label: 'Current Document' },
            { id: 'youtube' as const, label: 'Analyzed YouTube Video' },
            { id: 'multi_docs' as const, label: 'Multiple Documents' },
            { id: 'topic' as const, label: 'Research Question / Topic' }
          ].map((mode) => (
            <label key={mode.id} className="flex items-center gap-2 cursor-pointer text-academic-700 dark:text-academic-300">
              <input
                type="radio"
                name="sourceType"
                checked={sourceType === mode.id}
                onChange={() => setSourceType(mode.id)}
                className="text-primary-600"
              />
              <span>{mode.label}</span>
            </label>
          ))}
        </div>

        {/* Dynamic Source Target */}
        {sourceType === 'document' ? (
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 block mb-1.5">
              Select Source Document
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs font-semibold text-academic-900 dark:text-white focus:outline-none"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  📄 {doc.name} ({doc.pages} pages)
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 block mb-1.5">
              Topic / Research Question
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Explain Retrieval-Augmented Generation"
              className="w-full px-4 py-2.5 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs sm:text-sm text-academic-900 dark:text-white focus:outline-none"
            />
          </div>
        )}

        {/* Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 block mb-2">
              Duration
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['60 seconds', '2 minutes', '3 minutes', '5 minutes'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold truncate cursor-pointer ${
                    duration === d
                      ? 'bg-primary-600 text-white shadow-2xs'
                      : 'bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 block mb-2">
              Audience (Role Persona)
            </label>
            <div className="space-y-1">
              {(['Student', 'Teacher', 'Researcher'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTargetRole(r)}
                  className={`w-full py-1 px-2.5 rounded-lg text-xs font-semibold text-left cursor-pointer ${
                    targetRole === r
                      ? 'bg-primary-600 text-white'
                      : 'bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 block mb-2">
              Difficulty
            </label>
            <div className="space-y-1">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((aud) => (
                <button
                  key={aud}
                  type="button"
                  onClick={() => setAudience(aud)}
                  className={`w-full py-1 px-2.5 rounded-lg text-xs font-semibold text-left cursor-pointer ${
                    audience === aud
                      ? 'bg-primary-600 text-white'
                      : 'bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-300'
                  }`}
                >
                  {aud}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-academic-500 dark:text-academic-400 block mb-2">
              Visual Style
            </label>
            <div className="space-y-1">
              {(['Animated Educational', 'Technical Explainer', 'Whiteboard', 'Presentation'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStyle(st)}
                  className={`w-full py-1 px-2.5 rounded-lg text-xs font-semibold text-left truncate cursor-pointer ${
                    style === st
                      ? 'bg-primary-600 text-white'
                      : 'bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-300'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerateVideo}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isGenerating ? 'Synthesizing Educational Video...' : 'Generate Learning Video'}</span>
          </button>
        </div>
      </div>

      {/* Rendered Interactive Video Player (Ready & Playable with Audio!) */}
      {project && (
        <div className="space-y-4 select-text">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  VIDEO GENERATED & READY
                </span>
                <h3 className="text-xl font-bold text-academic-900 dark:text-white">
                  {project.title}
                </h3>
              </div>
              <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
                Duration: {project.duration} • Role Persona: {targetRole} • Visual Style: {project.style} • Click Play to hear narration!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const scriptText = project.scenes
                    .map((s) => `Scene ${s.sceneNumber}: ${s.title}\nVisual: ${s.visualDescription}\nNarration: ${s.narrationScript}\n`)
                    .join('\n');
                  const blob = new Blob([scriptText], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${project.title.replace(/\s+/g, '_')}_ProductionScript.txt`;
                  a.click();
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 text-academic-800 dark:text-academic-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Script</span>
              </button>

              <button
                onClick={() => {
                  onSaveToBookmarks({
                    title: project.title,
                    subtitle: `Role: ${targetRole} • Style: ${project.style} • Duration: ${project.duration}`,
                    content: project.scenes.map((s) => s.narrationScript).join(' '),
                    source: 'AI Learning Video Studio',
                    type: 'script'
                  });
                  alert('Video project script saved to Research Bookmarks!');
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Save to Bookmarks</span>
              </button>
            </div>
          </div>

          {/* Interactive HTML5 Video Player with Web Speech TTS Voice */}
          <InteractiveVideoPlayer project={project} />
        </div>
      )}

      {/* Scene by Scene Storyboard & Narration Review */}
      {project && (
        <div className="bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 select-text">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-academic-100 dark:border-academic-800 gap-3">
            <div>
              <h3 className="text-lg font-bold text-academic-900 dark:text-white">
                Educational Storyboard & Scene Narration Scripts ({project.scenes.length} Scenes)
              </h3>
              <p className="text-xs text-academic-500 dark:text-academic-400 mt-0.5">
                Review and edit narration text for each scene. Changes immediately update the live video player above!
              </p>
            </div>

            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating}
              className="px-3.5 py-1.5 rounded-xl border border-academic-200 dark:border-academic-700 hover:bg-academic-100 text-xs font-semibold text-academic-700 dark:text-academic-300 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Regenerate Video Scenes</span>
            </button>
          </div>

          {/* Scenes Breakdown */}
          <div className="space-y-3">
            {project.scenes.map((scene) => {
              const isExpanded = expandedScene === scene.sceneNumber;
              const isEditing = editingSceneNum === scene.sceneNumber;

              return (
                <div
                  key={scene.sceneNumber}
                  className="border border-academic-200 dark:border-academic-800 rounded-xl overflow-hidden bg-academic-50/40 dark:bg-academic-800/20"
                >
                  <button
                    onClick={() => setExpandedScene(isExpanded ? null : scene.sceneNumber)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-academic-100/50 dark:hover:bg-academic-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-7 w-7 rounded-lg bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-xs font-mono">
                        {scene.sceneNumber}
                      </span>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-academic-900 dark:text-white">
                          {scene.title}
                        </h4>
                        <span className="text-[11px] text-academic-400 font-mono">
                          Duration: {scene.durationSeconds} sec • On-Screen: "{scene.onScreenText}"
                        </span>
                      </div>
                    </div>

                    <ChevronDown
                      className={`h-4 w-4 text-academic-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-0 space-y-3 border-t border-academic-100 dark:border-academic-800/60 text-xs">
                      {/* Visual Description */}
                      <div className="p-3 rounded-lg bg-white dark:bg-academic-900 border border-academic-200/60 dark:border-academic-800">
                        <span className="text-[10px] uppercase font-bold text-academic-400 block mb-1">
                          Visual Scene Graphic
                        </span>
                        <p className="text-academic-700 dark:text-academic-300 italic">
                          {scene.visualDescription}
                        </p>
                      </div>

                      {/* Narration Script (Editable) */}
                      <div className="p-3 rounded-lg bg-white dark:bg-academic-900 border border-academic-200/60 dark:border-academic-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1">
                            <Volume2 className="h-3 w-3" />
                            <span>Spoken Narration Script</span>
                          </span>
                          {!isEditing ? (
                            <button
                              type="button"
                              onClick={() => handleStartSceneEdit(scene)}
                              className="text-[11px] font-semibold text-primary-600 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>Edit Script</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSaveSceneEdit(scene.sceneNumber)}
                              className="text-[11px] font-semibold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="h-3 w-3" />
                              <span>Save Edit</span>
                            </button>
                          )}
                        </div>

                        {!isEditing ? (
                          <p className="text-academic-800 dark:text-academic-200 font-sans leading-relaxed">
                            "{scene.narrationScript}"
                          </p>
                        ) : (
                          <textarea
                            value={editedNarration}
                            onChange={(e) => setEditedNarration(e.target.value)}
                            rows={3}
                            className="w-full p-2 text-xs rounded-lg border border-primary-300 dark:border-primary-700 bg-academic-50 dark:bg-academic-800 text-academic-900 dark:text-white focus:outline-none"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
