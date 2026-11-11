import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { DocumentList } from './components/documents/DocumentList';
import { DocumentUploadModal } from './components/documents/DocumentUploadModal';
import { DocumentViewerModal } from './components/documents/DocumentViewerModal';
import { ResearchAssistant } from './components/assistant/ResearchAssistant';
import { ResearchSummarizer } from './components/summarizer/ResearchSummarizer';
import { DocumentComparison } from './components/comparison/DocumentComparison';
import { ResearchExplorer } from './components/explorer/ResearchExplorer';
import { YouTubeResearchView } from './components/youtube/YouTubeResearchView';
import { VideoGenerator } from './components/video/VideoGenerator';
import { AssessmentView } from './components/assessment/AssessmentView';
import { RoleHubView } from './components/roles/RoleHubView';
import { CitationGenerator } from './components/citations/CitationGenerator';
import { ResearchInsights } from './components/dashboard/ResearchInsights';
import { AboutSystemView } from './components/about/AboutSystemView';
import { ResearchHistoryView } from './components/history/ResearchHistoryView';
import { SavedResearchView } from './components/bookmarks/SavedResearchView';
import { SettingsView } from './components/settings/SettingsView';
import { AuthScreen } from './components/auth/AuthScreen';
import { RAGService } from './services/ragService';
import {
  initialDocuments,
  sampleChatHistory,
  sampleHistory,
  sampleSavedItems,
  demoProfiles
} from './data/sampleData';
import {
  DocumentItem,
  NavTab,
  ChatMessage,
  UserProfile,
  UserRole,
  HistoryItem,
  SavedItem,
  YouTubeResearchResult,
  RecommendedVideo
} from './types';

export const App: React.FC = () => {
  // Authentication & Active Indian Academic Persona
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('ira_auth_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse cached user', e);
    }
    return demoProfiles.Student;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const loggedOut = sessionStorage.getItem('ira_logged_out');
    if (loggedOut === 'true') return false;
    return true;
  });

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Primary Data State with LocalStorage Persistence
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const stored = localStorage.getItem('ira_documents');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached documents', e);
    }
    return initialDocuments;
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem('ira_chat_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached chat history', e);
    }
    return sampleChatHistory;
  });

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('ira_history_items');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached history', e);
    }
    return sampleHistory;
  });

  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const stored = localStorage.getItem('ira_saved_items');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached saved items', e);
    }
    return sampleSavedItems;
  });

  // Persist state updates to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ira_documents', JSON.stringify(documents));
    } catch (e) {
      console.warn('Failed to save documents to localStorage', e);
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem('ira_chat_history', JSON.stringify(chatHistory));
    } catch (e) {
      console.warn('Failed to save chat history to localStorage', e);
    }
  }, [chatHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('ira_history_items', JSON.stringify(historyItems));
    } catch (e) {
      console.warn('Failed to save history items to localStorage', e);
    }
  }, [historyItems]);

  useEffect(() => {
    try {
      localStorage.setItem('ira_saved_items', JSON.stringify(savedItems));
    } catch (e) {
      console.warn('Failed to save saved items to localStorage', e);
    }
  }, [savedItems]);

  // Sync with backend ChromaDB repository on initial load
  useEffect(() => {
    fetch('/api/documents')
      .then((res) => res.json())
      .then((data) => {
        if (data.documents && Array.isArray(data.documents) && data.documents.length > 0) {
          setDocuments((prev) => {
            const existingIds = new Set(prev.map((d) => d.id));
            const newBackendDocs = data.documents.filter((d: DocumentItem) => !existingIds.has(d.id));
            if (newBackendDocs.length > 0) {
              return [...newBackendDocs, ...prev];
            }
            return prev;
          });
        }
      })
      .catch((err) => {
        console.warn('Backend document sync notice (offline mode active):', err);
      });
  }, []);

  // Cross-Tab Integration State (Analyzing recommended YouTube videos)
  const [activeYouTubeForAnalysis, setActiveYouTubeForAnalysis] = useState<YouTubeResearchResult | null>(null);

  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<DocumentItem | null>(null);

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Seamless Role Switching across Indian Academic Personas
  const handleSwitchRole = (role: UserRole) => {
    const targetProfile = demoProfiles[role] || {
      id: `usr-${role.toLowerCase()}`,
      name: role === 'Teacher' ? 'Prof. Rahul Verma' : role === 'Researcher' ? 'Dr. Arjun Reddy' : 'Aarav Sharma',
      email: role === 'Teacher' ? 'rahul.verma@faculty.edu.in' : role === 'Researcher' ? 'arjun.reddy@lab.edu.in' : 'aarav.sharma@research.edu.in',
      username: role === 'Teacher' ? 'rahul_prof' : role === 'Researcher' ? 'arjun_research' : 'aarav_student',
      role,
      avatar: role === 'Teacher' ? 'RV' : role === 'Researcher' ? 'AR' : 'AS',
      institution: role === 'Teacher' ? 'Indian Institute of Technology (IIT) Bombay' : role === 'Researcher' ? 'Indian Institute of Technology (IIT) Madras' : 'Indian Institute of Technology (IIT) Delhi',
      department: role === 'Teacher' ? 'Department of Electrical Engineering & Artificial Intelligence' : role === 'Researcher' ? 'Centre for Data Science & AI (RBC-DSAI)' : 'Department of Computer Science & Engineering'
    };
    setCurrentUser(targetProfile);
    localStorage.setItem('ira_auth_user', JSON.stringify(targetProfile));
  };

  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUser(user);
    sessionStorage.removeItem('ira_logged_out');
    localStorage.setItem('ira_auth_user', JSON.stringify(user));
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    sessionStorage.removeItem('ira_logged_out');
    localStorage.setItem('ira_auth_user', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await RAGService.logout();
    localStorage.removeItem('ira_auth_user');
    sessionStorage.setItem('ira_logged_out', 'true');
    setIsAuthenticated(false);
  };

  const handleUploadSuccess = (newDocs: DocumentItem[]) => {
    setDocuments((prev) => [...newDocs, ...prev]);
    setIsUploadOpen(false);

    // Record in history
    const historyEntry: HistoryItem = {
      id: `hist-${Date.now()}`,
      date: 'Just now',
      type: 'summary',
      title: `Indexed ${newDocs.length} Document(s) in ChromaDB`,
      sources: newDocs.map((d) => d.name),
      summaryText: `Ingested ${newDocs.map((d) => d.name).join(', ')} with hierarchical chunking and text-embedding-004 vectors.`,
      saved: false
    };
    setHistoryItems((prev) => [historyEntry, ...prev]);
  };

  const handleDeleteDoc = async (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    try {
      await RAGService.deleteDocument(docId);
    } catch (err) {
      console.warn('Backend delete notice:', err);
    }
  };

  const handleAskDoc = (_doc: DocumentItem) => {
    setActiveTab('assistant');
  };

  const handleSummarizeDoc = (_doc: DocumentItem) => {
    setActiveTab('summarizer');
  };

  const handleCompareDoc = (_doc: DocumentItem) => {
    setActiveTab('compare');
  };

  const handleCreateVideoDoc = (_doc: DocumentItem) => {
    setActiveTab('video');
  };

  const handleSaveToBookmarks = (item: {
    title: string;
    subtitle?: string;
    content: string;
    source: string;
    type: SavedItem['type'];
  }) => {
    const newItem: SavedItem = {
      id: `save-${Date.now()}`,
      title: item.title,
      subtitle: item.subtitle,
      content: item.content,
      source: item.source,
      savedAt: 'Just now',
      type: item.type
    };
    setSavedItems((prev) => [newItem, ...prev]);
  };

  const handleRemoveSaved = (id: string) => {
    setSavedItems((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDeleteHistory = (id: string) => {
    setHistoryItems((prev) => prev.filter((h) => h.id !== id));
  };

  const handleToggleSaveHistory = (id: string) => {
    setHistoryItems((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const updatedSaved = !h.saved;
          if (updatedSaved) {
            handleSaveToBookmarks({
              title: h.title,
              subtitle: `Audited from Research History (${h.type})`,
              content: h.summaryText || h.title,
              source: h.sources.join(', '),
              type: 'answer'
            });
          }
          return { ...h, saved: updatedSaved };
        }
        return h;
      })
    );
  };

  const handleOpenHistoryItem = (item: HistoryItem) => {
    if (item.type === 'question') setActiveTab('assistant');
    else if (item.type === 'summary') setActiveTab('summarizer');
    else if (item.type === 'comparison') setActiveTab('compare');
    else if (item.type === 'youtube') setActiveTab('youtube');
    else if (item.type === 'video_script') setActiveTab('video');
    else setActiveTab('explorer');
  };

  const handleAskYouTube = (_video: YouTubeResearchResult) => {
    setActiveTab('assistant');
  };

  const handleCreateVideoFromYT = (_video: YouTubeResearchResult) => {
    setActiveTab('video');
  };

  // Seamless pipeline: from Recommended Video in Research Assistant -> Analyze in YouTube Research
  const handleAnalyzeRecommendedVideo = (rec: RecommendedVideo) => {
    const targetVideo: YouTubeResearchResult = {
      id: `yt-rec-${Date.now()}`,
      url: rec.url,
      videoId: rec.videoId,
      title: rec.title,
      channel: rec.channel,
      duration: rec.duration,
      transcriptAvailable: true,
      transcriptText: `Transcript for ${rec.title}. In this video, ${rec.channel} provides an in-depth lecture on ${rec.conceptTag}.`,
      transcriptEntries: [
        { timestamp: '00:15', text: `Welcome to this tutorial on ${rec.conceptTag}.` },
        { timestamp: '02:30', text: 'Let us examine how vectors and attention scores operate in high-dimensional space.' },
        { timestamp: '05:45', text: 'Notice how this aligns directly with the equations in the published paper.' }
      ],
      keyTopics: [rec.conceptTag, 'Vector Projections', 'Empirical Insights'],
      summary: `A thorough educational breakdown of ${rec.conceptTag} by ${rec.channel}. ${rec.relevanceExplanation}`,
      importantPoints: [
        `Explains ${rec.conceptTag} with visual geometric intuition.`,
        'Demonstrates matrix dot-product operations step-by-step.',
        'Clarifies common misconceptions regarding token representation.'
      ],
      beginnerExplanation: `Think of this video as a visual walkthrough that turns complex math from the research paper into clear, animated diagrams.`,
      analyzedAt: 'Just now'
    };

    setActiveYouTubeForAnalysis(targetVideo);
    setActiveTab('youtube');
  };

  // Auth Gate: If unauthenticated, show interactive login screen with 6 Indian academic accounts
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-academic-50 dark:bg-academic-950 text-academic-900 dark:text-academic-50 transition-colors select-none">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        indexedDocsCount={documents.length}
        user={currentUser}
        onLogout={handleLogout}
        savedItemsCount={savedItems.length}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onUploadClick={() => setIsUploadOpen(true)}
          onStartResearchClick={() => setActiveTab('assistant')}
          indexedDocsCount={documents.length}
          user={currentUser}
          onSwitchRole={handleSwitchRole}
          onSwitchUser={handleSwitchUser}
          onLogout={handleLogout}
          savedCount={savedItems.length}
          onOpenBookmarks={() => setActiveTab('bookmarks')}
          searchQuery={globalSearchQuery}
          setSearchQuery={setGlobalSearchQuery}
        />

        {/* Tab View Container */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'dashboard' && (
            <DashboardView
              documents={documents}
              user={currentUser}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenDoc={(doc) => setSelectedDocForViewer(doc)}
              onAskDoc={handleAskDoc}
              onSummarizeDoc={handleSummarizeDoc}
              onCompareDoc={handleCompareDoc}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentList
              documents={documents}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenDoc={(doc) => setSelectedDocForViewer(doc)}
              onAskDoc={handleAskDoc}
              onSummarizeDoc={handleSummarizeDoc}
              onDeleteDoc={handleDeleteDoc}
            />
          )}

          {activeTab === 'assistant' && (
            <ResearchAssistant
              documents={documents}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              userRole={currentUser.role}
              onSaveToBookmarks={handleSaveToBookmarks}
              onAnalyzeRecommendedVideo={handleAnalyzeRecommendedVideo}
            />
          )}

          {activeTab === 'assessment' && (
            <AssessmentView
              documents={documents}
              userRole={currentUser.role}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'role_hub' && (
            <RoleHubView
              currentRole={currentUser.role}
              onSwitchRole={handleSwitchRole}
              documents={documents}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'summarizer' && (
            <ResearchSummarizer
              documents={documents}
              onSaveToBookmarks={handleSaveToBookmarks}
            />
          )}

          {activeTab === 'compare' && (
            <DocumentComparison
              documents={documents}
              onSaveToBookmarks={handleSaveToBookmarks}
            />
          )}

          {activeTab === 'explorer' && (
            <ResearchExplorer />
          )}

          {activeTab === 'youtube' && (
            <YouTubeResearchView
              documents={documents}
              preSelectedVideo={activeYouTubeForAnalysis}
              onAskYouTube={handleAskYouTube}
              onCreateVideoFromYT={handleCreateVideoFromYT}
            />
          )}

          {activeTab === 'video' && (
            <VideoGenerator
              documents={documents}
              userRole={currentUser.role}
              onSaveToBookmarks={handleSaveToBookmarks}
            />
          )}

          {activeTab === 'citations' && (
            <CitationGenerator documents={documents} />
          )}

          {activeTab === 'insights' && (
            <div className="p-8 max-w-7xl mx-auto space-y-6">
              <ResearchInsights
                documents={documents}
                onOpenUpload={() => setIsUploadOpen(true)}
              />
            </div>
          )}

          {activeTab === 'about' && (
            <AboutSystemView />
          )}

          {activeTab === 'history' && (
            <ResearchHistoryView
              history={historyItems}
              onDeleteHistory={handleDeleteHistory}
              onToggleSaveHistory={handleToggleSaveHistory}
              onOpenHistoryItem={handleOpenHistoryItem}
            />
          )}

          {activeTab === 'bookmarks' && (
            <SavedResearchView
              savedItems={savedItems}
              onRemoveSaved={handleRemoveSaved}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView darkMode={darkMode} setDarkMode={setDarkMode} />
          )}
        </main>
      </div>

      {/* Upload Document Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        existingDocs={documents}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Document Detail Preview & Side-by-Side Tools Modal */}
      <DocumentViewerModal
        document={selectedDocForViewer}
        onClose={() => setSelectedDocForViewer(null)}
        onAsk={handleAskDoc}
        onSummarize={handleSummarizeDoc}
        onCompare={handleCompareDoc}
        onCreateVideo={handleCreateVideoDoc}
      />
    </div>
  );
};
