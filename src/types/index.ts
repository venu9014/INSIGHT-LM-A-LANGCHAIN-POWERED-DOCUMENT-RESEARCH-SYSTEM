export type DocumentType = 'Research Papers' | 'Notes' | 'Reports' | 'All';

export type UserRole = 'Student' | 'Teacher' | 'Researcher';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
  avatar: string;
  institution: string;
  department?: string;
  bio?: string;
}

export interface SampleAccountCredential {
  name: string;
  role: UserRole;
  email: string;
  username: string;
  passwordHint: string;
  institution: string;
  department: string;
  avatar: string;
  bio: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'Research Papers' | 'Notes' | 'Reports';
  pages: number;
  uploadedAt: string;
  status: 'Indexed' | 'Processing' | 'Failed';
  size: string;
  authors?: string;
  year?: number;
  doi?: string;
  abstract?: string;
  tags?: string[];
  chunksCount?: number;
  sourceId: string;
  pageContent?: Array<{ pageNumber: number; text: string; section?: string }>;
}

export interface ResearchSource {
  documentId: string;
  documentName: string;
  page?: number;
  timestamp?: string;
  sourceType: 'document' | 'youtube';
  similarityScore: number;
  snippet: string;
  section?: string;
}

export interface RecommendedVideo {
  id: string;
  videoId: string;
  title: string;
  channel: string;
  duration: string;
  thumbnailUrl: string;
  url: string;
  relevanceExplanation: string;
  targetAudience: 'Student' | 'Teacher' | 'Researcher' | 'All';
  conceptTag: string;
}

export interface ContinueLearningResource {
  title: string;
  type: 'paper' | 'documentation' | 'tutorial' | 'website';
  url: string;
  domain: string;
  description: string;
  relevance: string;
}

export interface TechnicalTermExplanation {
  term: string;
  meaning: string;
  contextInPaper: string;
}

export interface IllustrativeExample {
  title: string;
  scenario: string;
  explanation: string;
  isAiGenerated: true;
}

export interface StudentRoleExtras {
  simpleNotes: string[];
  examOrientedPoints: string[];
  quickRevision: string;
  practiceQuestions: string[];
}

export interface TeacherRoleExtras {
  learningObjective: string;
  teachingExplanation: string;
  classroomActivity: string;
  discussionQuestions: string[];
  quickQuiz: Array<{ question: string; answer: string }>;
}

export interface ResearcherRoleExtras {
  technicalDefinition: string;
  researchChallenges: string[];
  potentialResearchGaps: string[];
  futureScope: string;
  suggestedDatasetsAndBenchmarks: string[];
}

export interface DocumentVideoComparison {
  documentName: string;
  videoTitle: string;
  commonConcepts: string[];
  differences: string[];
  additionalInfoFromVideo: string[];
  simplifiedExplanation: string;
  possibleMisunderstandings: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  grounded?: boolean;
  explanationRole?: UserRole;
  sources?: ResearchSource[];
  recommendedVideos?: RecommendedVideo[];
  continueLearning?: ContinueLearningResource[];
  technicalTerms?: TechnicalTermExplanation[];
  illustrativeExample?: IllustrativeExample;
  studentExtras?: StudentRoleExtras;
  teacherExtras?: TeacherRoleExtras;
  researcherExtras?: ResearcherRoleExtras;
  metrics?: {
    retrievalTimeMs: number;
    tokensCount: number;
    model: string;
    depthMode?: 'Brief' | 'Detailed' | 'Deep Research';
    explanationRole?: UserRole;
  };
  saved?: boolean;
}

export interface SummaryResult {
  id: string;
  documentId: string;
  documentName: string;
  summaryType: 'Executive Summary' | 'Detailed Research Summary' | 'Beginner Explanation' | 'Key Findings' | 'Methodology Summary' | 'Research Paper Breakdown';
  length: 'Short' | 'Medium' | 'Long';
  language: string;
  audience: 'Beginner' | 'Intermediate' | 'Advanced';
  abstract: string;
  problemStatement: string;
  methodology: string;
  dataset?: string;
  modelAlgorithm?: string;
  results?: string[];
  advantages?: string[];
  limitations: string[];
  futureScope?: string;
  conclusion: string;
  generatedAt: string;
  saved?: boolean;
}

export interface ComparisonDimension {
  category: string;
  values: Record<string, string>;
}

export interface ComparisonReport {
  id: string;
  selectedPaperIds: string[];
  dimensions: ComparisonDimension[];
  insights: {
    commonApproaches: string[];
    majorDifferences: string[];
    strengths: string[];
    weaknesses: string[];
    researchOpportunities: string[];
    possibleResearchGaps: string[];
  };
  generatedAt: string;
  saved?: boolean;
}

export interface ExternalSource {
  title: string;
  domain: string;
  url: string;
  year: number;
  description: string;
  relevanceScore: number;
}

export interface ResearchExplorerResult {
  topic: string;
  depth: 'Quick Research' | 'Standard Research' | 'Deep Research';
  overview: string;
  keyConcepts: Array<{ term: string; definition: string }>;
  importantFindings: string[];
  relatedTopics: string[];
  researchTrends: string[];
  potentialResearchGaps: string[];
  sources: ExternalSource[];
  generatedAt: string;
}

export interface YouTubeResearchResult {
  id: string;
  url: string;
  videoId: string;
  title: string;
  channel: string;
  duration: string;
  thumbnailUrl?: string;
  transcriptAvailable: boolean;
  transcriptText: string;
  transcriptEntries: Array<{ timestamp: string; text: string }>;
  keyTopics: string[];
  summary: string;
  importantPoints: string[];
  beginnerExplanation: string;
  analyzedAt: string;
}

export interface VideoScene {
  sceneNumber: number;
  title: string;
  durationSeconds: number;
  narrationScript: string;
  onScreenText: string;
  visualDescription: string;
  bulletPoints?: string[];
}

export interface LearningVideoProject {
  id: string;
  title: string;
  topic: string;
  sourceDocId?: string;
  sourceType: 'document' | 'youtube' | 'multi_docs' | 'topic';
  duration: '60 seconds' | '2 minutes' | '3 minutes' | '5 minutes';
  durationSeconds: number;
  audience: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  style: 'Animated Educational' | 'Technical Explainer' | 'Whiteboard' | 'Presentation';
  status: 'script_review' | 'planning' | 'generating_script' | 'synthesizing_audio' | 'rendering_scenes' | 'ready';
  scenes: VideoScene[];
  createdAt: string;
  backendConnected?: boolean;
  backendMessage?: string;
}

export interface CitationItem {
  id: string;
  docId: string;
  paperTitle: string;
  authors: string[];
  year: number;
  venue: string;
  doi?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  url?: string;
  publisher?: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  type: 'question' | 'summary' | 'comparison' | 'youtube' | 'video_script' | 'explorer';
  title: string;
  sources: string[];
  summaryText?: string;
  saved?: boolean;
  recommendedVideoCount?: number;
}

export interface SavedItem {
  id: string;
  type: 'document' | 'answer' | 'passage' | 'summary' | 'script' | 'youtube';
  title: string;
  subtitle?: string;
  content: string;
  source: string;
  savedAt: string;
  url?: string;
}

// Assessment & Model Question Paper Types
export type QuestionFormat =
  | 'mcq'
  | 'true_false'
  | 'fill_blank'
  | 'short_answer'
  | 'long_answer'
  | 'descriptive'
  | 'numerical'
  | 'case_study';

export interface SubQuestionItem {
  id: string;
  question: string;
  marks: number;
  modelAnswer?: string;
}

export interface RubricCriterion {
  criterion: string;
  marks: number;
}

export interface QuestionItem {
  id: string;
  format: QuestionFormat;
  section: string;
  question: string;
  marks: number;
  options?: string[];
  correctIndex?: number;
  correctAnswer?: string;
  acceptedAnswers?: string[];
  explanation?: string;
  modelAnswer?: string;
  keyPoints?: string[];
  rubric?: RubricCriterion[];
  givenData?: string;
  formula?: string;
  stepByStepSolution?: string;
  correctNumericalValue?: number | string;
  unit?: string;
  scenario?: string;
  subQuestions?: SubQuestionItem[];
  sourceReference?: string;
}

export interface QuestionPaperFull {
  id: string;
  title: string;
  subject: string;
  course: string;
  gradeLevel: string;
  examType: string;
  durationMinutes: number;
  totalMarks: number;
  instructions: string[];
  sections: string[];
  questions: QuestionItem[];
  status: 'draft' | 'published';
  createdAt: string;
}

export interface StudentAssignment {
  id: string;
  paperId: string;
  title: string;
  subject: string;
  course: string;
  gradeLevel: string;
  durationMinutes: number;
  totalMarks: number;
  dueDate: string;
  status: 'active' | 'closed';
  questionsCount: number;
  assignedBy: string;
  createdAt: string;
}

export interface QuestionEvaluationResult {
  isCorrect: boolean | null;
  awardedMarks: number;
  maxMarks: number;
  correctAnswer?: any;
  explanation?: string;
  feedback?: string;
  modelAnswer?: string;
}

export interface StudentSubmission {
  id: string;
  paperId: string;
  paperTitle: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  timeSpentSeconds: number;
  answers: Record<string, any>;
  autoGradedScore: number;
  maxObjectiveMarks: number;
  manualGradedScore: number;
  maxSubjectiveMarks: number;
  totalScore: number;
  totalPossibleMarks: number;
  percentage: number;
  status: 'pending_teacher_review' | 'final_graded';
  teacherFeedback?: string;
  gradedAt?: string;
  questionResults?: Record<string, QuestionEvaluationResult>;
}

export interface ProjectVideoItem {
  id: string;
  videoId: string;
  title: string;
  channel: string;
  duration: string;
  thumbnailUrl: string;
  url: string;
  relevanceExplanation: string;
  conceptTag: string;
}

export interface ProjectVideoCategory {
  id: string;
  title: string;
  description: string;
  videos: ProjectVideoItem[];
}

export interface ProjectVideoRecommendationResponse {
  project_title: string;
  tech_stack: string[];
  total_categories: number;
  total_videos: number;
  categories: ProjectVideoCategory[];
}

export interface ExamQuestionPartA {
  questionNumber: number;
  question: string;
  marks: number;
  sourceSection: string;
  modelAnswer: string;
}

export interface ExamQuestionPartB {
  questionNumber: number;
  questionA: string;
  questionB: string; // OR choice
  marks: number;
  sourceSection: string;
  modelAnswerA: string;
  modelAnswerB: string;
}

export interface ModelQuestionPaper {
  id: string;
  documentId: string;
  documentTitle: string;
  courseTitle: string;
  degreeProgram: string;
  semester: string;
  timeAllowed: string;
  maximumMarks: number;
  instructions: string[];
  partA: ExamQuestionPartA[];
  partB: ExamQuestionPartB[];
  generatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceDocument: string;
  pageNumber: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: Record<string, number>;
  timeTakenSeconds: number;
  submittedAt: string;
}

export type NavTab = 
  | 'dashboard' 
  | 'documents' 
  | 'assistant' 
  | 'summarizer' 
  | 'compare' 
  | 'explorer' 
  | 'youtube' 
  | 'video' 
  | 'assessment'
  | 'role_hub'
  | 'citations' 
  | 'history' 
  | 'bookmarks' 
  | 'insights'
  | 'about'
  | 'settings';
