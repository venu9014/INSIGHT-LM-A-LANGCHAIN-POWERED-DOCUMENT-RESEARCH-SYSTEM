import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquareQuote,
  FileText,
  GitCompare,
  Compass,
  Youtube,
  Video,
  BookmarkCheck,
  History,
  Bookmark,
  Settings,
  BrainCircuit,
  Moon,
  Sun,
  ChevronRight,
  GraduationCap,
  Layers,
  UserCheck,
  LineChart,
  Info,
  LogOut
} from 'lucide-react';
import { NavTab, UserProfile } from '../../types';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  indexedDocsCount: number;
  user: UserProfile;
  onLogout: () => void;
  savedItemsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  indexedDocsCount,
  user,
  onLogout,
  savedItemsCount
}) => {
  // Role-customized navigation items
  const getNavItems = () => {
    if (user.role === 'Student') {
      return [
        { id: 'dashboard' as NavTab, label: 'Learning Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'documents' as NavTab, label: 'My Documents', icon: BookOpen, badge: indexedDocsCount.toString() },
        { id: 'assistant' as NavTab, label: 'Ask AI Assistant', icon: MessageSquareQuote, badge: 'Student RAG' },
        { id: 'assessment' as NavTab, label: 'Assigned Tests & Quizzes', icon: GraduationCap, badge: 'Auto-Graded' },
        { id: 'role_hub' as NavTab, label: 'Student Study Hub', icon: Layers, badge: 'Student' },
        { id: 'summarizer' as NavTab, label: 'Quick Summarizer', icon: FileText, badge: null },
        { id: 'youtube' as NavTab, label: 'YouTube Learning & Projects', icon: Youtube, badge: 'Curated' },
        { id: 'video' as NavTab, label: 'AI Explainer Video', icon: Video, badge: 'Voiceover' },
        { id: 'bookmarks' as NavTab, label: 'Saved Notes & Q&A', icon: Bookmark, badge: savedItemsCount > 0 ? savedItemsCount.toString() : null },
        { id: 'history' as NavTab, label: 'Learning History', icon: History, badge: null },
        { id: 'settings' as NavTab, label: 'Settings', icon: Settings, badge: null },
      ];
    }

    if (user.role === 'Teacher') {
      return [
        { id: 'dashboard' as NavTab, label: 'Teaching Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'documents' as NavTab, label: 'Course Materials', icon: BookOpen, badge: indexedDocsCount.toString() },
        { id: 'assessment' as NavTab, label: 'Question Paper Studio & Bank', icon: GraduationCap, badge: '8 Formats' },
        { id: 'assistant' as NavTab, label: 'AI Teaching Assistant', icon: MessageSquareQuote, badge: 'Pedagogy' },
        { id: 'role_hub' as NavTab, label: 'Teacher Pedagogy Hub', icon: Layers, badge: 'Teacher' },
        { id: 'summarizer' as NavTab, label: 'Curriculum Summaries', icon: FileText, badge: null },
        { id: 'compare' as NavTab, label: 'Compare Textbooks & Papers', icon: GitCompare, badge: null },
        { id: 'youtube' as NavTab, label: 'Lecture Discovery & Projects', icon: Youtube, badge: 'Classroom' },
        { id: 'video' as NavTab, label: 'Lesson Video Creator', icon: Video, badge: 'TTS Voice' },
        { id: 'insights' as NavTab, label: 'Classroom Insights', icon: LineChart, badge: 'Live' },
        { id: 'history' as NavTab, label: 'Teaching History', icon: History, badge: null },
        { id: 'bookmarks' as NavTab, label: 'Saved Materials', icon: Bookmark, badge: savedItemsCount > 0 ? savedItemsCount.toString() : null },
        { id: 'settings' as NavTab, label: 'Settings', icon: Settings, badge: null },
      ];
    }

    // Researcher
    return [
      { id: 'dashboard' as NavTab, label: 'Research Dashboard', icon: LayoutDashboard, badge: null },
      { id: 'documents' as NavTab, label: 'Document Corpus', icon: BookOpen, badge: indexedDocsCount.toString() },
      { id: 'assistant' as NavTab, label: 'Advanced RAG Assistant', icon: MessageSquareQuote, badge: 'Literature Q&A' },
      { id: 'compare' as NavTab, label: 'Compare Papers Matrix', icon: GitCompare, badge: 'Multi-Doc' },
      { id: 'explorer' as NavTab, label: 'Research Explorer', icon: Compass, badge: 'Web Search' },
      { id: 'citations' as NavTab, label: 'Citations & BibTeX', icon: BookmarkCheck, badge: 'Export' },
      { id: 'assessment' as NavTab, label: 'Assessment Studio', icon: GraduationCap, badge: 'Exams' },
      { id: 'role_hub' as NavTab, label: 'Researcher Hub', icon: Layers, badge: 'Researcher' },
      { id: 'summarizer' as NavTab, label: 'Literature Summarizer', icon: FileText, badge: null },
      { id: 'youtube' as NavTab, label: 'Academic Talks & Projects', icon: Youtube, badge: 'Lectures' },
      { id: 'video' as NavTab, label: 'Video Abstract Studio', icon: Video, badge: 'TTS Voice' },
      { id: 'insights' as NavTab, label: 'Corpus Insights', icon: LineChart, badge: 'Live' },
      { id: 'bookmarks' as NavTab, label: 'Saved Evidence', icon: Bookmark, badge: savedItemsCount > 0 ? savedItemsCount.toString() : null },
      { id: 'history' as NavTab, label: 'Research History', icon: History, badge: null },
      { id: 'about' as NavTab, label: 'About System', icon: Info, badge: null },
      { id: 'settings' as NavTab, label: 'Settings', icon: Settings, badge: null },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-72 bg-white dark:bg-academic-900 border-r border-academic-200 dark:border-academic-800 flex flex-col h-screen select-none transition-colors duration-200 shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-academic-100 dark:border-academic-800/80">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white shadow-md shadow-primary-500/20 ring-1 ring-white/20">
            <BrainCircuit className="h-6 w-6 text-primary-100" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-academic-900 dark:text-white flex items-center gap-1.5">
              <span>Intelligent Research</span>
            </h1>
            <p className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 tracking-wide uppercase">
              Assistant
            </p>
          </div>
        </div>

        {/* Vector DB status badge */}
        <div className="mt-3.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-academic-50 dark:bg-academic-800/50 border border-academic-200/60 dark:border-academic-700/50 text-[11px] text-academic-600 dark:text-academic-300">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Vector DB Active
          </span>
          <span className="font-mono text-[10px] text-academic-400 dark:text-academic-400 font-semibold">
            ChromaDB v0.5
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-academic-400 dark:text-academic-500">
          Academic Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/70 dark:text-primary-300 font-semibold shadow-xs border border-primary-100 dark:border-primary-800/60'
                  : 'text-academic-600 hover:text-academic-900 dark:text-academic-400 dark:hover:text-academic-100 hover:bg-academic-100/70 dark:hover:bg-academic-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-primary-600 dark:text-primary-400' : 'text-academic-400 dark:text-academic-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-semibold ${
                      item.badge === 'NEW'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        : item.badge === 'TTS Voice'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : isActive
                        ? 'bg-primary-200/80 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                        : 'bg-academic-200/70 text-academic-600 dark:bg-academic-800 dark:text-academic-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="h-3.5 w-3.5 text-primary-500 dark:text-primary-400" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Role Indicator & Hub Shortcut */}
      <div
        onClick={() => setActiveTab('role_hub')}
        className="p-3 mx-3 mb-2 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/70 dark:border-academic-700/60 text-xs cursor-pointer hover:border-primary-400 transition-all group"
      >
        <div className="flex items-center justify-between text-academic-700 dark:text-academic-300 font-semibold mb-1">
          <span className="flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-primary-500" />
            <span>Role: {user.role}</span>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors">
            Hub ↗
          </span>
        </div>
        <p className="text-[11px] text-academic-500 dark:text-academic-400 leading-tight">
          Click to view dedicated {user.role} notes & tools
        </p>
      </div>

      {/* Bottom User Profile with Dark Mode */}
      <div className="p-3 border-t border-academic-100 dark:border-academic-800/80 bg-white/50 dark:bg-academic-900/50">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-academic-100 dark:hover:bg-academic-800/60 transition-colors">
          <div className="flex items-center gap-2.5 truncate">
            <div className="h-8 w-8 rounded-full bg-academic-800 text-white flex items-center justify-center font-bold text-xs shadow-inner ring-2 ring-primary-500/30 shrink-0">
              {user.avatar}
            </div>
            <div className="text-left truncate">
              <p className="text-xs font-semibold text-academic-900 dark:text-white leading-tight truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-academic-500 dark:text-academic-400 truncate">
                {user.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Light Academic Mode' : 'Dark Research Mode'}
              className="p-1.5 rounded-lg text-academic-500 hover:text-academic-800 dark:text-academic-400 dark:hover:text-white hover:bg-academic-200/60 dark:hover:bg-academic-700/60 transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={onLogout}
              title="Sign Out / Switch User Account"
              className="p-1.5 rounded-lg text-academic-500 hover:text-red-600 dark:text-academic-400 dark:hover:text-red-400 hover:bg-academic-200/60 dark:hover:bg-academic-700/60 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
