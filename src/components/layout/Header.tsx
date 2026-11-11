import React, { useState, useRef, useEffect } from 'react';
import { Search, Database, Sparkles, Bookmark, UserCheck, ShieldCheck, GraduationCap, School, Microscope, ChevronDown, LogOut, User } from 'lucide-react';
import { NavTab, UserProfile, UserRole } from '../../types';
import { sampleIndianAccounts } from '../../data/sampleData';

interface HeaderProps {
  activeTab: NavTab;
  onUploadClick: () => void;
  onStartResearchClick: () => void;
  indexedDocsCount: number;
  user: UserProfile;
  onSwitchRole: (role: UserRole) => void;
  onSwitchUser?: (user: UserProfile) => void;
  onLogout: () => void;
  savedCount: number;
  onOpenBookmarks: () => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onUploadClick,
  onStartResearchClick,
  indexedDocsCount,
  user,
  onSwitchRole,
  onSwitchUser,
  onLogout,
  savedCount,
  onOpenBookmarks,
  searchQuery,
  setSearchQuery
}) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Research Overview & Metrics', subtitle: 'Academic Intelligence Workspace' };
      case 'documents':
        return { title: 'Research Documents Repository', subtitle: 'Indexed Vector Library & Corpus Management' };
      case 'assistant':
        return { title: 'Research Assistant', subtitle: 'Grounded Context Retrieval & Multi-Document Q&A' };
      case 'assessment':
        return { title: 'Exams & Quiz Assessment Studio', subtitle: 'University Model Question Papers & Interactive Test-Taking' };
      case 'role_hub':
        return { title: `${user.role} Academic Workspace`, subtitle: 'Curated Study Materials, Lesson Plans & Research Gaps' };
      case 'summarizer':
        return { title: 'Research Summarizer', subtitle: 'Multi-Perspective Scientific Literature Synthesis' };
      case 'compare':
        return { title: 'Compare Research Papers', subtitle: '10-Dimensional Methodological Comparison Matrix' };
      case 'explorer':
        return { title: 'Research Explorer', subtitle: 'Topic-Guided Deep Literature Discovery' };
      case 'youtube':
        return { title: 'Document-Based YouTube Research', subtitle: 'Auto-Matched Video Lectures & Multi-Modal Transcription' };
      case 'video':
        return { title: 'AI Learning Video Studio', subtitle: 'Web Speech TTS Voiceover & Dynamic Scene Animations' };
      case 'citations':
        return { title: 'Reference & Citation Generator', subtitle: 'IEEE, APA, MLA & BibTeX Scientific Formatting' };
      case 'insights':
        return { title: 'Dynamic Research Insights', subtitle: 'Corpus-Level Topic Modeling & Methodological Analysis' };
      case 'history':
        return { title: 'Research History', subtitle: 'Chronological Audit Trail of Inquiries & Generated Reports' };
      case 'bookmarks':
        return { title: 'Saved Research Vault', subtitle: 'Pinned Literature Passages, Verified Answers & Citations' };
      case 'about':
        return { title: 'About System & Architecture', subtitle: 'Technical Specifications, LangChain Pipeline & Vector DB Engine' };
      case 'settings':
        return { title: 'System Architecture & Settings', subtitle: 'RAG Pipeline Hyperparameters & Technical Architecture' };
      default:
        return { title: 'Intelligent Research Assistant', subtitle: 'AI-Powered Research & Learning Platform' };
    }
  };

  const { title, subtitle } = getTabTitle(activeTab);

  return (
    <header className="h-16 px-8 border-b border-academic-200/80 dark:border-academic-800 bg-white/80 dark:bg-academic-900/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between transition-colors select-none">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-base font-bold text-academic-900 dark:text-white leading-tight">
            {title}
          </h2>
          <p className="text-[11px] text-academic-500 dark:text-academic-400 font-medium">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Role Switching Quick Hub Inside Header */}
      <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-academic-100 dark:bg-academic-800 border border-academic-200/80 dark:border-academic-700">
        <span className="text-[10px] font-bold uppercase tracking-wider text-academic-400 px-2">
          Switch Role:
        </span>
        {(['Student', 'Teacher', 'Researcher'] as UserRole[]).map((r) => {
          const isCurrent = user.role === r;
          return (
            <button
              key={r}
              onClick={() => onSwitchRole(r)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isCurrent
                  ? 'bg-primary-600 text-white shadow-2xs'
                  : 'text-academic-600 dark:text-academic-300 hover:bg-academic-200 dark:hover:bg-academic-700'
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

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Bookmarks Icon Button */}
        <button
          onClick={onOpenBookmarks}
          title="Open Saved Research Vault"
          className="relative p-2 rounded-xl border border-academic-200 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-800 text-academic-600 dark:text-academic-300 transition-colors cursor-pointer"
        >
          <Bookmark className="h-4 w-4" />
          {savedCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary-600 text-white font-bold text-[9px] flex items-center justify-center font-mono shadow-xs">
              {savedCount}
            </span>
          )}
        </button>

        {/* RAG Status Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-academic-100 dark:bg-academic-800 text-xs text-academic-700 dark:text-academic-300 border border-academic-200/70 dark:border-academic-700/70">
          <Database className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
          <span className="font-mono text-[11px] font-medium">
            {indexedDocsCount} Docs Indexed
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        </div>

        {/* Global Quick Action Buttons */}
        <button
          onClick={onStartResearchClick}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-academic-100 hover:bg-academic-200/80 dark:bg-academic-800 dark:hover:bg-academic-700 text-academic-800 dark:text-academic-200 transition-colors border border-academic-300/60 dark:border-academic-700 cursor-pointer"
        >
          <Search className="h-3.5 w-3.5 text-academic-500" />
          <span>🔎 Research</span>
        </button>

        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-sm shadow-primary-600/30 transition-all hover:shadow-md cursor-pointer"
        >
          <span className="font-bold text-sm leading-none">+</span>
          <span>Upload PDF</span>
        </button>

        {/* User Profile & Account Switcher Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowAccountMenu((prev) => !prev)}
            title="Switch User Account / Profile"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-academic-200 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-800 transition-colors cursor-pointer"
          >
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {user.avatar || user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-academic-800 dark:text-academic-200 leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-academic-400 font-medium">
                {user.role}
              </span>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-academic-400 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showAccountMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-800 rounded-2xl shadow-xl shadow-academic-950/20 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* Current User Header */}
              <div className="px-4 pb-3 border-b border-academic-100 dark:border-academic-800">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                    {user.avatar || user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-academic-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-academic-500 truncate">
                      {user.email}
                    </p>
                    {user.institution && (
                      <p className="text-[10px] text-academic-400 truncate mt-0.5">
                        {user.institution}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Switcher Section */}
              <div className="px-3 pt-2.5 pb-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-academic-400 px-2 mb-1.5 flex items-center justify-between">
                  <span>Indian Academic Accounts (6)</span>
                  <span className="text-academic-500 font-mono text-[9px]">scrypt auth</span>
                </p>
                <div className="space-y-1 max-h-56 overflow-y-auto custom-scrollbar">
                  {sampleIndianAccounts.map((acc) => {
                    const isActive = user.email === acc.email || user.username === acc.username;
                    return (
                      <button
                        key={acc.username}
                        onClick={() => {
                          if (onSwitchUser) {
                            onSwitchUser({
                              id: `usr-${acc.username.replace('_', '-')}`,
                              name: acc.name,
                              email: acc.email,
                              username: acc.username,
                              role: acc.role,
                              avatar: acc.avatar,
                              institution: acc.institution,
                              department: acc.department,
                              bio: acc.bio
                            });
                          } else {
                            onSwitchRole(acc.role);
                          }
                          setShowAccountMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800'
                            : 'hover:bg-academic-100 dark:hover:bg-academic-800 border border-transparent'
                        }`}
                      >
                        <div className={`h-7 w-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                          acc.role === 'Student'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : acc.role === 'Teacher'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          {acc.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-academic-800 dark:text-academic-200 truncate">
                              {acc.name}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                              acc.role === 'Student'
                                ? 'bg-blue-100/70 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                                : acc.role === 'Teacher'
                                ? 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                                : 'bg-purple-100/70 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
                            }`}>
                              {acc.role}
                            </span>
                          </div>
                          <span className="text-[10px] text-academic-400 block truncate">
                            {acc.institution}
                          </span>
                        </div>
                        {isActive && (
                          <div className="h-1.5 w-1.5 rounded-full bg-primary-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Logout Button */}
              <div className="pt-2 px-3 border-t border-academic-100 dark:border-academic-800 mt-1">
                <button
                  onClick={() => {
                    setShowAccountMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out of Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
