import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, BookOpen, Layers, Award, Radio } from 'lucide-react';
import { LearningVideoProject } from '../../types';

interface InteractiveVideoPlayerProps {
  project: LearningVideoProject;
}

export const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({ project }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const scenes = project.scenes;
  const currentScene = scenes[currentSceneIdx] || scenes[0];
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Web Speech API Voice synthesis helper
  const speakCurrentScene = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // cancel any active narration
    if (isMuted) return;

    const textToSpeak = `${currentScene.title}. ${currentScene.narrationScript}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsVoiceActive(true);
    };

    utterance.onend = () => {
      setIsVoiceActive(false);
      // Advance to next scene automatically when speech concludes
      if (currentSceneIdx < scenes.length - 1) {
        setCurrentSceneIdx((prev) => prev + 1);
        setSceneProgress(0);
      } else {
        setIsPlaying(false);
        setSceneProgress(100);
      }
    };

    utterance.onerror = () => {
      setIsVoiceActive(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsVoiceActive(false);
  };

  // Synchronize playback with speech
  useEffect(() => {
    if (isPlaying) {
      speakCurrentScene();
    } else {
      stopSpeech();
    }

    return () => {
      stopSpeech();
    };
  }, [isPlaying, currentSceneIdx, isMuted]);

  // Visual progress bar ticker
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      const stepTime = 100;
      const totalSteps = (currentScene.durationSeconds * 1000) / stepTime;
      const increment = 100 / totalSteps;

      timer = setInterval(() => {
        setSceneProgress((prev) => {
          if (prev >= 100) {
            // Scene completed
            return 100;
          }
          return prev + increment;
        });
      }, stepTime);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIdx, currentScene.durationSeconds]);

  const handleReset = () => {
    stopSpeech();
    setIsPlaying(false);
    setCurrentSceneIdx(0);
    setSceneProgress(0);
  };

  const handleSelectScene = (idx: number) => {
    stopSpeech();
    setCurrentSceneIdx(idx);
    setSceneProgress(0);
    if (isPlaying) {
      setTimeout(() => speakCurrentScene(), 100);
    }
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-academic-950 text-white shadow-2xl border border-academic-800">
      {/* Video Viewport / Animated Canvas */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-academic-950 via-primary-950 to-academic-900 flex flex-col justify-between p-6 sm:p-8 select-none">
        {/* Top Overlay Badge */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-primary-600/90 text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>AI Learning Video Studio</span>
            </span>
            <span className="px-2 py-1 rounded-md bg-white/10 text-[11px] font-mono text-academic-300 backdrop-blur-xs">
              Scene {currentSceneIdx + 1}/{scenes.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Audio Narration Status */}
            <div className={`px-2.5 py-1 rounded-md text-[11px] font-mono flex items-center gap-1.5 transition-all ${
              isVoiceActive && !isMuted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/10 text-academic-400'
            }`}>
              <Radio className={`h-3 w-3 ${isVoiceActive && !isMuted ? 'animate-pulse text-emerald-400' : ''}`} />
              <span>{isMuted ? 'Muted' : isVoiceActive ? '🎙 Speaking Narration' : 'Voice Ready'}</span>
            </div>
            <span className="text-[11px] font-mono text-academic-400 hidden sm:inline">
              Style: {project.style}
            </span>
          </div>
        </div>

        {/* Center Animated Visual Scene */}
        <div className="my-auto text-center space-y-4 max-w-2xl mx-auto z-10">
          {/* Animated Graphic Node */}
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-400 shadow-xl shadow-primary-500/20 text-white mx-auto transform transition-transform duration-500 hover:scale-105">
            <Sparkles className={`h-8 w-8 text-white ${isPlaying ? 'animate-bounce' : ''}`} />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-bottom-2 duration-300">
              {currentScene.title}
            </h3>
            <p className="text-xs sm:text-sm text-primary-200/90 font-medium max-w-xl mx-auto leading-relaxed">
              {currentScene.visualDescription}
            </p>
          </div>

          {/* Key Bullet Visual Cards */}
          {currentScene.bulletPoints && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {currentScene.bulletPoints.map((bp, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-academic-100 font-medium backdrop-blur-xs shadow-inner"
                >
                  ✓ {bp}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Audio Narration Subtitle Box */}
        <div className="z-10 bg-black/75 backdrop-blur-md rounded-xl p-3 border border-white/15 max-w-3xl mx-auto w-full shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-1 rounded bg-primary-600 text-white mt-0.5 shrink-0">
              <Volume2 className={`h-3.5 w-3.5 ${isVoiceActive ? 'animate-pulse text-emerald-300' : ''}`} />
            </div>
            <p className="text-xs text-academic-100 leading-relaxed font-sans font-medium">
              "{currentScene.narrationScript}"
            </p>
          </div>
        </div>

        {/* Ambient Grid Effect */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      {/* Video Controls Bar */}
      <div className="bg-academic-900 p-4 border-t border-academic-800 space-y-3">
        {/* Timeline Progress Scrub */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1">
            {scenes.map((scene, idx) => {
              const isPast = idx < currentSceneIdx;
              const isCurrent = idx === currentSceneIdx;
              return (
                <div
                  key={scene.sceneNumber}
                  onClick={() => handleSelectScene(idx)}
                  className="flex-1 h-2.5 rounded-full bg-academic-800 cursor-pointer overflow-hidden relative group transition-all"
                  title={`Scene ${idx + 1}: ${scene.title}`}
                >
                  <div
                    className="h-full bg-primary-500 transition-all duration-100"
                    style={{
                      width: isPast ? '100%' : isCurrent ? `${sceneProgress}%` : '0%',
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] font-mono text-academic-400">
            <span>Scene {currentSceneIdx + 1} of {scenes.length}: {currentScene.title}</span>
            <span>Total Duration: {project.duration}</span>
          </div>
        </div>

        {/* Bottom Play Buttons & Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white transition-all flex items-center gap-2 text-xs font-semibold shadow-md cursor-pointer"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
              <span>{isPlaying ? 'Pause Video' : 'Play Video with Voice'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-academic-800 hover:bg-academic-700 text-academic-300 transition-colors cursor-pointer"
              title="Restart Video from Beginning"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-red-950/60 border-red-800 text-red-300'
                  : 'bg-academic-800 border-academic-700 hover:bg-academic-700 text-academic-300'
              }`}
              title={isMuted ? 'Unmute Audio Narration' : 'Mute Audio Narration'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>

          <div className="text-xs font-semibold text-academic-300 flex items-center gap-2">
            <span className="text-[11px] font-mono text-primary-400 bg-primary-950/60 px-2 py-0.5 rounded border border-primary-800">
              Interactive TTS Engine Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
