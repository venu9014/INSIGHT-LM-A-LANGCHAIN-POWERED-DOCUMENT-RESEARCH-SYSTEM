import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  FileText,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ChevronRight,
  BookOpen,
  Send,
  Timer,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Printer,
  ChevronDown,
  ChevronUp,
  Share2,
  BarChart2,
  CheckSquare,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  DocumentItem,
  UserRole,
  UserProfile,
  QuestionPaperFull,
  QuestionItem,
  QuestionFormat,
  StudentAssignment,
  StudentSubmission,
  ModelQuestionPaper,
  QuizQuestion,
  QuizResult
} from '../../types';
import { RAGService } from '../../services/ragService';

interface AssessmentViewProps {
  documents: DocumentItem[];
  userRole?: UserRole;
  currentUser?: UserProfile;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  documents,
  userRole = 'Student',
  currentUser
}) => {
  const currentRole = userRole || currentUser?.role || 'Student';
  const selectedDoc = documents[0];

  // Active Main Sub-Tab depending on role
  const [teacherTab, setTeacherTab] = useState<'create' | 'bank' | 'submissions'>('create');
  const [studentTab, setStudentTab] = useState<'assigned' | 'test' | 'results' | 'practice'>('assigned');

  // Teacher: Question Paper Creation State
  const [topic, setTopic] = useState('Deep Learning, Transformer Attention & RAG');
  const [subject, setSubject] = useState('CS-804: Advanced Artificial Intelligence');
  const [course, setCourse] = useState('Neural Representation Learning');
  const [gradeLevel, setGradeLevel] = useState('Final Year Engineering / Postgraduate');
  const [examType, setExamType] = useState('University End-Semester Examination');
  const [durationMinutes, setDurationMinutes] = useState(180);
  const [selectedFormats, setSelectedFormats] = useState<QuestionFormat[]>([
    'mcq', 'true_false', 'fill_blank', 'short_answer', 'long_answer', 'descriptive', 'numerical', 'case_study'
  ]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [paperQuestions, setPaperQuestions] = useState<QuestionItem[]>([]);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [paperTitle, setPaperTitle] = useState('End-Semester Examination: Advanced Artificial Intelligence');
  const [saveStatusMessage, setSaveStatusMessage] = useState<string | null>(null);

  // Teacher: Bank & Submissions State
  const [questionPapersBank, setQuestionPapersBank] = useState<QuestionPaperFull[]>([]);
  const [submissionsList, setSubmissionsList] = useState<StudentSubmission[]>([]);
  const [gradingSubmission, setGradingSubmission] = useState<StudentSubmission | null>(null);
  const [manualGrades, setManualGrades] = useState<Record<string, number>>({});
  const [teacherFeedbackText, setTeacherFeedbackText] = useState('Good effort, thorough conceptual explanation.');
  const [previewPaper, setPreviewPaper] = useState<QuestionPaperFull | null>(null);

  // Student: Test Taking State
  const [assignedAssessments, setAssignedAssessments] = useState<StudentAssignment[]>([]);
  const [activeTestPaper, setActiveTestPaper] = useState<QuestionPaperFull | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, any>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [testTimeRemaining, setTestTimeRemaining] = useState<number>(180 * 60);
  const [isTestActive, setIsTestActive] = useState(false);
  const [lastSubmissionResult, setLastSubmissionResult] = useState<StudentSubmission | null>(null);
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Student / Researcher Practice Quick Quiz
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quickQuizAnswers, setQuickQuizAnswers] = useState<Record<string, number>>({});
  const [quickQuizResult, setQuickQuizResult] = useState<QuizResult | null>(null);
  const [isGeneratingQuickQuiz, setIsGeneratingQuickQuiz] = useState(false);

  // Load initial data on mount or role change
  useEffect(() => {
    loadTeacherData();
    loadStudentData();
  }, [currentRole]);

  const loadTeacherData = async () => {
    try {
      const papers = await RAGService.fetchTeacherQuestionPapers('Teacher');
      if (papers && papers.length > 0) {
        setQuestionPapersBank(papers);
        if (paperQuestions.length === 0) {
          setPaperQuestions(papers[0].questions || []);
          setPaperTitle(papers[0].title);
        }
      }
      const subs = await RAGService.fetchTeacherSubmissions(undefined, 'Teacher');
      if (subs && subs.length > 0) {
        setSubmissionsList(subs);
      }
    } catch (e) {
      console.warn('Load teacher data notice:', e);
    }
  };

  const loadStudentData = async () => {
    try {
      const assigns = await RAGService.fetchStudentAssessments('Student');
      if (assigns && assigns.length > 0) {
        setAssignedAssessments(assigns);
      }
    } catch (e) {
      console.warn('Load student data notice:', e);
    }
  };

  // Timer countdown for active test
  useEffect(() => {
    let timer: any;
    if (isTestActive && testTimeRemaining > 0 && !lastSubmissionResult) {
      timer = setInterval(() => {
        setTestTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestActive, testTimeRemaining, lastSubmissionResult]);

  // Generate Questions for Teacher
  const handleTeacherGenerateQuestions = async () => {
    setIsGeneratingQuestions(true);
    setSaveStatusMessage(null);
    try {
      const generated = await RAGService.generateTeacherQuestions(
        {
          topic,
          subject,
          grade_level: gradeLevel,
          difficulty: 'Medium',
          doc_id: selectedDoc?.id,
          formats: selectedFormats
        },
        'Teacher'
      );
      if (generated && generated.length > 0) {
        setPaperQuestions(generated);
        setSaveStatusMessage(`Successfully generated ${generated.length} questions across ${selectedFormats.length} formats!`);
      }
    } catch (err: any) {
      setSaveStatusMessage(`Notice: ${err.message || 'Generated questions catalog.'}`);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Add Manual Question
  const handleAddManualQuestion = (fmt: QuestionFormat) => {
    const newId = `q-manual-${Date.now()}`;
    const newQ: QuestionItem = {
      id: newId,
      format: fmt,
      section: fmt === 'mcq' || fmt === 'true_false' || fmt === 'fill_blank' ? 'Part A: Objective Section' : 'Part B: Analytical Section',
      question: `New ${fmt.replace('_', ' ').toUpperCase()} Question: Enter problem statement here`,
      marks: fmt === 'mcq' || fmt === 'true_false' || fmt === 'fill_blank' ? 2 : fmt === 'short_answer' ? 4 : fmt === 'long_answer' ? 8 : 10,
      options: fmt === 'mcq' ? ['Option A', 'Option B', 'Option C', 'Option D'] : fmt === 'true_false' ? ['True', 'False'] : undefined,
      correctIndex: 0,
      correctAnswer: fmt === 'fill_blank' ? 'key_term' : undefined,
      modelAnswer: 'Enter model answer and marking scheme here.'
    };
    setPaperQuestions((prev) => [...prev, newQ]);
  };

  // Delete Question
  const handleDeleteQuestion = (qid: string) => {
    setPaperQuestions((prev) => prev.filter((q) => q.id !== qid));
  };

  // Move Question Up/Down
  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= paperQuestions.length) return;
    const updated = [...paperQuestions];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setPaperQuestions(updated);
  };

  // Save Paper Draft
  const handleSavePaperDraft = async () => {
    try {
      const total = paperQuestions.reduce((acc, q) => acc + (q.marks || 0), 0);
      const paperToSave: Partial<QuestionPaperFull> = {
        title: paperTitle,
        subject,
        course,
        gradeLevel,
        examType,
        durationMinutes,
        totalMarks: total,
        instructions: [
          'Answer all questions in sequential order.',
          'Part A contains objective questions.',
          'Part B & C contain analytical and technical questions.'
        ],
        sections: Array.from(new Set(paperQuestions.map((q) => q.section || 'General'))),
        questions: paperQuestions,
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      const saved = await RAGService.saveQuestionPaper(paperToSave, 'Teacher');
      setSaveStatusMessage(`Draft "${saved.title}" saved successfully to question bank!`);
      loadTeacherData();
    } catch (e: any) {
      setSaveStatusMessage(`Error saving paper: ${e.message}`);
    }
  };

  // Publish Paper & Assign to Class
  const handlePublishPaper = async (paperId?: string) => {
    try {
      let targetId = paperId;
      if (!targetId) {
        // Save first if creating fresh
        const total = paperQuestions.reduce((acc, q) => acc + (q.marks || 0), 0);
        const saved = await RAGService.saveQuestionPaper(
          {
            title: paperTitle,
            subject,
            course,
            gradeLevel,
            examType,
            durationMinutes,
            totalMarks: total,
            instructions: ['Answer all questions.'],
            sections: Array.from(new Set(paperQuestions.map((q) => q.section || 'General'))),
            questions: paperQuestions,
            status: 'draft',
            createdAt: new Date().toISOString()
          },
          'Teacher'
        );
        targetId = saved.id;
      }
      const pub = await RAGService.publishQuestionPaper(targetId, 'Teacher');
      setSaveStatusMessage(`Paper published! Active assignment "${pub.assignment.title}" created for students.`);
      loadTeacherData();
      loadStudentData();
    } catch (e: any) {
      setSaveStatusMessage(`Error publishing paper: ${e.message}`);
    }
  };

  // Student: Start Assessment
  const handleStartTest = async (assignment: StudentAssignment) => {
    try {
      const paper = await RAGService.fetchStudentAssessmentDetail(assignment.paperId, 'Student');
      setActiveTestPaper(paper);
      setStudentAnswers({});
      setFlaggedQuestions(new Set());
      setTestTimeRemaining(assignment.durationMinutes * 60);
      setIsTestActive(true);
      setLastSubmissionResult(null);
      setStudentTab('test');
    } catch (e: any) {
      alert(`Could not load assessment: ${e.message}`);
    }
  };

  // Student: Answer selection
  const handleStudentAnswerChange = (qid: string, val: any) => {
    setStudentAnswers((prev) => ({ ...prev, [qid]: val }));
  };

  // Toggle Flag Question
  const handleToggleFlag = (qid: string) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(qid)) next.delete(qid);
      else next.add(qid);
      return next;
    });
  };

  // Student: Submit Test
  const handleSubmitTest = async () => {
    if (!activeTestPaper) return;
    setIsSubmittingTest(true);
    setShowSubmitConfirm(false);
    try {
      const submission = await RAGService.submitStudentAssessment(
        activeTestPaper.id,
        {
          studentId: currentUser?.id || 'user-student',
          studentName: currentUser?.name || 'Alex Chen',
          answers: studentAnswers,
          timeSpentSeconds: (activeTestPaper.durationMinutes * 60) - testTimeRemaining
        },
        'Student'
      );
      setLastSubmissionResult(submission);
      setIsTestActive(false);
      setStudentTab('results');
      loadTeacherData(); // update submissions in teacher view
    } catch (err: any) {
      alert(`Failed to submit test: ${err.message}`);
    } finally {
      setIsSubmittingTest(false);
    }
  };

  const handleAutoSubmitTest = () => {
    if (isTestActive) {
      handleSubmitTest();
    }
  };

  // Teacher: Grade Student Submission
  const handleOpenGrading = (sub: StudentSubmission) => {
    setGradingSubmission(sub);
    const initialGrades: Record<string, number> = {};
    if (sub.questionResults) {
      Object.entries(sub.questionResults).forEach(([qid, res]) => {
        if (res.isCorrect === null || res.feedback) {
          initialGrades[qid] = res.awardedMarks || 0;
        }
      });
    }
    setManualGrades(initialGrades);
    setTeacherFeedbackText(sub.teacherFeedback || 'Good effort, thorough conceptual explanation.');
  };

  const handleSaveGrade = async () => {
    if (!gradingSubmission) return;
    try {
      const updated = await RAGService.gradeStudentSubmission(
        gradingSubmission.id,
        manualGrades,
        teacherFeedbackText,
        'Teacher'
      );
      setGradingSubmission(null);
      loadTeacherData();
      alert(`Grading finalized! Total Score: ${updated.totalScore} / ${updated.totalPossibleMarks} (${updated.percentage}%)`);
    } catch (err: any) {
      alert(`Failed to save grade: ${err.message}`);
    }
  };

  // Format Time
  const formatSeconds = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Top Header Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-academic-200/80 dark:border-academic-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
            <GraduationCap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Role Mode: {currentRole} Assessment Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-academic-900 dark:text-white">
            {currentRole === 'Teacher' ? 'Teacher Examination & Question Management' : 'Student Assessments & Examination Studio'}
          </h1>
          <p className="text-xs sm:text-sm text-academic-500 dark:text-academic-400 mt-1">
            {currentRole === 'Teacher'
              ? 'Generate university model question papers covering 8 question formats, edit drafts, publish assignments, and grade student submissions.'
              : 'Take active assigned university examinations with live timer, receive instant auto-grading for objective questions, and review detailed feedback.'}
          </p>
        </div>

        {/* Role Workspace Switcher helper banner */}
        <div className="flex items-center gap-2">
          {currentRole === 'Teacher' ? (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-academic-100 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs font-semibold">
              <button
                onClick={() => setTeacherTab('create')}
                className={`px-3 py-1.5 rounded-lg transition-all ${teacherTab === 'create' ? 'bg-primary-600 text-white shadow-xs' : 'text-academic-600 dark:text-academic-300'}`}
              >
                Question Paper Generator
              </button>
              <button
                onClick={() => { setTeacherTab('bank'); loadTeacherData(); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${teacherTab === 'bank' ? 'bg-primary-600 text-white shadow-xs' : 'text-academic-600 dark:text-academic-300'}`}
              >
                Question Bank ({questionPapersBank.length})
              </button>
              <button
                onClick={() => { setTeacherTab('submissions'); loadTeacherData(); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${teacherTab === 'submissions' ? 'bg-primary-600 text-white shadow-xs' : 'text-academic-600 dark:text-academic-300'}`}
              >
                Submissions & Grading ({submissionsList.length})
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-academic-100 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs font-semibold">
              <button
                onClick={() => setStudentTab('assigned')}
                className={`px-3 py-1.5 rounded-lg transition-all ${studentTab === 'assigned' ? 'bg-emerald-600 text-white shadow-xs' : 'text-academic-600 dark:text-academic-300'}`}
              >
                Assigned Tests ({assignedAssessments.length})
              </button>
              {isTestActive && (
                <button
                  onClick={() => setStudentTab('test')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${studentTab === 'test' ? 'bg-amber-600 text-white shadow-xs animate-pulse' : 'text-academic-600 dark:text-academic-300'}`}
                >
                  Active Test ({formatSeconds(testTimeRemaining)})
                </button>
              )}
              {lastSubmissionResult && (
                <button
                  onClick={() => setStudentTab('results')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${studentTab === 'results' ? 'bg-indigo-600 text-white shadow-xs' : 'text-academic-600 dark:text-academic-300'}`}
                >
                  My Test Result ({lastSubmissionResult.percentage}%)
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TEACHER WORKSPACE */}
      {/* ===================================================================== */}
      {currentRole === 'Teacher' && (
        <div className="space-y-6">
          {/* TAB 1: QUESTION PAPER GENERATOR */}
          {teacherTab === 'create' && (
            <div className="space-y-6">
              {/* Paper Configuration Settings */}
              <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-academic-100 dark:border-academic-800 pb-3">
                  <h2 className="text-base font-bold text-academic-900 dark:text-white flex items-center gap-2">
                    <Edit3 className="h-4 w-4 text-primary-600" />
                    <span>Examination Parameters & AI Generator</span>
                  </h2>
                  <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold">
                    8 Formats Supported (MCQ, True/False, Blank, Short, Long, Essay, Numerical, Case Study)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
                  <div>
                    <label className="text-academic-500 uppercase tracking-wider block mb-1">Paper Title</label>
                    <input
                      type="text"
                      value={paperTitle}
                      onChange={(e) => setPaperTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-academic-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-academic-500 uppercase tracking-wider block mb-1">Course / Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-academic-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-academic-500 uppercase tracking-wider block mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-academic-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-academic-500 uppercase tracking-wider block mb-1">Grade Level</label>
                    <input
                      type="text"
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-academic-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 8 Format Toggle Selectors */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-academic-500 block mb-2">
                    Include Question Formats:
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: 'mcq', label: '1. MCQ' },
                      { id: 'true_false', label: '2. True / False' },
                      { id: 'fill_blank', label: '3. Fill in Blanks' },
                      { id: 'short_answer', label: '4. Short Answer' },
                      { id: 'long_answer', label: '5. Long Answer' },
                      { id: 'descriptive', label: '6. Descriptive Essay' },
                      { id: 'numerical', label: '7. Numerical / Quantitative' },
                      { id: 'case_study', label: '8. Applied Case Study' }
                    ].map((fmt) => {
                      const isSelected = selectedFormats.includes(fmt.id as QuestionFormat);
                      return (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => {
                            setSelectedFormats((prev) =>
                              isSelected ? prev.filter((f) => f !== fmt.id) : [...prev, fmt.id as QuestionFormat]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary-600 text-white shadow-2xs'
                              : 'bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-400'
                          }`}
                        >
                          {fmt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AI Generator CTA & Manual Add */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-academic-100 dark:border-academic-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTeacherGenerateQuestions}
                      disabled={isGeneratingQuestions}
                      className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-xs shadow-md shadow-primary-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>{isGeneratingQuestions ? 'Generating with AI...' : 'Generate Questions with AI'}</span>
                    </button>

                    <div className="relative inline-block text-left group">
                      <button
                        type="button"
                        className="px-4 py-2.5 rounded-xl bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 text-academic-700 dark:text-academic-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Question Manually</span>
                        <ChevronDown className="h-3.5 w-3.5 ml-1" />
                      </button>
                      <div className="hidden group-hover:block absolute left-0 mt-1 w-52 rounded-xl bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-700 shadow-xl z-30 py-1 text-xs">
                        <button onClick={() => handleAddManualQuestion('mcq')} className="w-full px-3 py-1.5 text-left hover:bg-academic-100 dark:hover:bg-academic-800">1. Multiple Choice</button>
                        <button onClick={() => handleAddManualQuestion('true_false')} className="w-full px-3 py-1.5 text-left hover:bg-academic-100 dark:hover:bg-academic-800">2. True / False</button>
                        <button onClick={() => handleAddManualQuestion('fill_blank')} className="w-full px-3 py-1.5 text-left hover:bg-academic-100 dark:hover:bg-academic-800">3. Fill in Blanks</button>
                        <button onClick={() => handleAddManualQuestion('short_answer')} className="w-full px-3 py-1.5 text-left hover:bg-academic-100 dark:hover:bg-academic-800">4. Short Answer</button>
                        <button onClick={() => handleAddManualQuestion('long_answer')} className="w-full px-3 py-1.5 text-left hover:bg-academic-100 dark:hover:bg-academic-800">5. Long Answer</button>
                        <button onClick={() => handleAddManualQuestion('descriptive')} className="w-full px-3 py-1.5 text-left hover:bg-academic-100 dark:hover:bg-academic-800">6. Descriptive Essay</button>
                        <button onClick={() => handleAddManualQuestion('numerical')} className="w-full px-3 py-1.5 text-left hover:bg-academic-100 dark:hover:bg-academic-800">7. Numerical Problem</button>
                        <button onClick={() => handleAddManualQuestion('case_study')} className="w-full px-3 py-1.5 text-left hover:bg-academic-100 dark:hover:bg-academic-800">8. Case Study</button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAnswerKey(!showAnswerKey)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        showAnswerKey
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                          : 'bg-white dark:bg-academic-800 text-academic-700 dark:text-academic-300 border-academic-300 dark:border-academic-700'
                      }`}
                    >
                      {showAnswerKey ? '✓ Answer Key Visible' : 'Show Answer Keys'}
                    </button>
                    <button
                      onClick={handleSavePaperDraft}
                      className="px-4 py-2 rounded-xl bg-academic-800 hover:bg-academic-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={() => handlePublishPaper()}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 cursor-pointer"
                    >
                      Publish & Assign
                    </button>
                  </div>
                </div>

                {saveStatusMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-200">
                    {saveStatusMessage}
                  </div>
                )}
              </div>

              {/* Question Paper Review & Reordering List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-academic-500">
                    Draft Questions ({paperQuestions.length}) • Total Marks: {paperQuestions.reduce((a, b) => a + (b.marks || 0), 0)}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const total = paperQuestions.reduce((a, b) => a + (b.marks || 0), 0);
                        setPreviewPaper({
                          id: 'preview',
                          title: paperTitle,
                          subject,
                          course,
                          gradeLevel,
                          examType,
                          durationMinutes,
                          totalMarks: total,
                          instructions: [
                            'Answer all questions in order.',
                            'Section A is objective.',
                            'Section B is analytical.'
                          ],
                          sections: Array.from(new Set(paperQuestions.map((q) => q.section || 'General'))),
                          questions: paperQuestions,
                          status: 'draft',
                          createdAt: new Date().toISOString()
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 text-academic-700 dark:text-academic-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Official Exam Preview</span>
                    </button>
                  </div>
                </div>

                {paperQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="h-6 w-6 rounded-lg bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-academic-100 dark:bg-academic-800 text-academic-700 dark:text-academic-300">
                          {q.format.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-academic-500 font-medium">
                          {q.section}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                          {q.marks} Marks
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMoveQuestion(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded text-academic-400 hover:text-academic-700 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveQuestion(idx, 'down')}
                          disabled={idx === paperQuestions.length - 1}
                          className="p-1 rounded text-academic-400 hover:text-academic-700 disabled:opacity-30 cursor-pointer"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1 rounded text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Question text (Editable inline) */}
                    <div>
                      <textarea
                        value={q.question}
                        onChange={(e) => {
                          const updated = [...paperQuestions];
                          updated[idx].question = e.target.value;
                          setPaperQuestions(updated);
                        }}
                        rows={2}
                        className="w-full p-2.5 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs sm:text-sm text-academic-900 dark:text-white font-medium focus:outline-none"
                      />
                    </div>

                    {/* Format specific details */}
                    {q.format === 'mcq' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                              q.correctIndex === oIdx && showAnswerKey
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-semibold'
                                : 'bg-academic-50 dark:bg-academic-800/40 border-academic-200 dark:border-academic-700 text-academic-800 dark:text-academic-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`mcq-${q.id}`}
                              checked={q.correctIndex === oIdx}
                              onChange={() => {
                                const updated = [...paperQuestions];
                                updated[idx].correctIndex = oIdx;
                                setPaperQuestions(updated);
                              }}
                              className="text-primary-600"
                            />
                            <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {q.format === 'true_false' && (
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        {(['True', 'False'] as const).map((choice, cIdx) => (
                          <label key={choice} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`tf-${q.id}`}
                              checked={q.correctIndex === cIdx}
                              onChange={() => {
                                const updated = [...paperQuestions];
                                updated[idx].correctIndex = cIdx;
                                setPaperQuestions(updated);
                              }}
                            />
                            <span>{choice}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.format === 'fill_blank' && (
                      <div className="text-xs text-academic-600 dark:text-academic-400 font-medium">
                        Expected Blank Answer: <span className="font-bold text-primary-600 dark:text-primary-400">"{q.correctAnswer}"</span>
                      </div>
                    )}

                    {q.format === 'numerical' && (
                      <div className="p-3 rounded-xl bg-academic-50 dark:bg-academic-800/50 text-xs space-y-1">
                        <div><strong>Given Data:</strong> {q.givenData}</div>
                        <div><strong>Formula:</strong> {q.formula}</div>
                        <div><strong>Correct Value:</strong> {q.correctNumericalValue} {q.unit}</div>
                      </div>
                    )}

                    {q.format === 'case_study' && q.subQuestions && (
                      <div className="p-3 rounded-xl bg-academic-50 dark:bg-academic-800/50 text-xs space-y-2">
                        <div className="font-semibold text-academic-700 dark:text-academic-300">
                          Case Scenario: {q.scenario}
                        </div>
                        {q.subQuestions.map((sq, sqIdx) => (
                          <div key={sqIdx} className="pl-3 border-l-2 border-primary-500">
                            <strong>({String.fromCharCode(97 + sqIdx)}) {sq.question}</strong> ({sq.marks} Marks)
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Answer Key & Marking Scheme (Revealed on Toggle) */}
                    {showAnswerKey && (
                      <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-xs space-y-1 text-emerald-900 dark:text-emerald-200">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Official Marking Scheme & Model Answer:</span>
                        </div>
                        <p className="leading-relaxed">
                          {q.modelAnswer || q.explanation || `Correct value: ${q.correctAnswer || q.correctIndex}`}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: QUESTION BANK */}
          {teacherTab === 'bank' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-academic-500">
                  Question Papers & Published Assignments ({questionPapersBank.length})
                </h3>
              </div>

              {questionPapersBank.map((paper) => (
                <div
                  key={paper.id}
                  className="p-5 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        paper.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                      }`}>
                        {paper.status}
                      </span>
                      <span className="text-xs text-academic-500">{paper.course}</span>
                    </div>
                    <h4 className="text-base font-bold text-academic-900 dark:text-white">
                      {paper.title}
                    </h4>
                    <p className="text-xs text-academic-500 dark:text-academic-400">
                      Duration: {paper.durationMinutes} mins • Total Marks: {paper.totalMarks} • {paper.questions?.length || 0} Questions
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewPaper(paper)}
                      className="px-3 py-1.5 rounded-lg bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 text-academic-700 dark:text-academic-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>
                    {paper.status !== 'published' && (
                      <button
                        onClick={() => handlePublishPaper(paper.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Publish to Students
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SUBMISSIONS & GRADING STUDIO */}
          {teacherTab === 'submissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-academic-500">
                  Student Submissions Received ({submissionsList.length})
                </h3>
              </div>

              {submissionsList.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        sub.status === 'final_graded'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                      }`}>
                        {sub.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-academic-500">Student ID: {sub.studentId}</span>
                    </div>
                    <h4 className="text-base font-bold text-academic-900 dark:text-white">
                      {sub.studentName} — {sub.paperTitle}
                    </h4>
                    <p className="text-xs text-academic-500 dark:text-academic-400">
                      Auto-Graded: {sub.autoGradedScore} / {sub.maxObjectiveMarks} • Total Score: {sub.totalScore} / {sub.totalPossibleMarks} ({sub.percentage}%) • Time: {formatSeconds(sub.timeSpentSeconds)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenGrading(sub)}
                      className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Award className="h-4 w-4" />
                      <span>{sub.status === 'final_graded' ? 'Review & Re-grade' : 'Grade Subjective Section'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* STUDENT WORKSPACE */}
      {/* ===================================================================== */}
      {currentRole === 'Student' && (
        <div className="space-y-6">
          {/* TAB 1: ASSIGNED ASSESSMENTS LIST */}
          {studentTab === 'assigned' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-academic-900 text-white shadow-md space-y-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-emerald-400" />
                  <span>My Active University Examination Papers</span>
                </h2>
                <p className="text-xs text-emerald-100">
                  These assessments are published by your professors. Click "Start Examination" to take the test with a real countdown timer and instant objective auto-grading.
                </p>
              </div>

              {assignedAssessments.map((assign) => (
                <div
                  key={assign.id}
                  className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        Active Assignment
                      </span>
                      <span className="text-xs text-academic-500">{assign.course}</span>
                    </div>
                    <h3 className="text-lg font-bold text-academic-900 dark:text-white">
                      {assign.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-academic-500 dark:text-academic-400">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Duration: {assign.durationMinutes} mins</span>
                      <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" /> Maximum Marks: {assign.totalMarks}</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> Questions: {assign.questionsCount}</span>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => handleStartTest(assign)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Start Examination</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: INTERACTIVE TEST TAKING STUDIO */}
          {studentTab === 'test' && activeTestPaper && (
            <div className="space-y-6">
              {/* Floating Top Banner with Live Countdown */}
              <div className="sticky top-16 z-10 p-4 rounded-2xl bg-academic-900 text-white shadow-xl border border-academic-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{activeTestPaper.title}</span>
                  </h3>
                  <p className="text-[11px] text-academic-400">
                    Answered {Object.keys(studentAnswers).length} of {activeTestPaper.questions.length} Questions
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 ${
                    testTimeRemaining < 300 ? 'bg-red-600 text-white animate-pulse' : 'bg-academic-800 text-emerald-400'
                  }`}>
                    <Timer className="h-4 w-4" />
                    <span>{formatSeconds(testTimeRemaining)}</span>
                  </div>

                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer shadow-xs"
                  >
                    Submit Test
                  </button>
                </div>
              </div>

              {/* Questions Stream */}
              <div className="space-y-6">
                {activeTestPaper.questions.map((q, idx) => {
                  const isFlagged = flaggedQuestions.has(q.id);
                  const isAnswered = studentAnswers[q.id] !== undefined && studentAnswers[q.id] !== '';

                  return (
                    <div
                      key={q.id}
                      className={`p-6 rounded-2xl bg-white dark:bg-academic-900 border transition-all ${
                        isFlagged
                          ? 'border-amber-400 dark:border-amber-600 shadow-sm'
                          : 'border-academic-200/80 dark:border-academic-800 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-academic-100 dark:border-academic-800 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="h-7 w-7 rounded-lg bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-bold text-xs flex items-center justify-center">
                            Q{idx + 1}
                          </span>
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-academic-100 dark:bg-academic-800 text-academic-700 dark:text-academic-300">
                            {q.format.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-academic-500">{q.section}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                            {q.marks} Marks
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleFlag(q.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                              isFlagged
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                                : 'text-academic-400 hover:text-academic-700'
                            }`}
                          >
                            {isFlagged ? '★ Flagged' : '☆ Mark for Review'}
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm sm:text-base font-semibold text-academic-900 dark:text-white leading-relaxed mb-4">
                        {q.question}
                      </h4>

                      {/* Format Controls for Student Response */}
                      {q.format === 'mcq' && q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt, oIdx) => (
                            <label
                              key={oIdx}
                              className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                                studentAnswers[q.id] === oIdx
                                  ? 'bg-primary-50 dark:bg-primary-950/60 border-primary-500 text-primary-950 dark:text-primary-100 font-semibold shadow-2xs'
                                  : 'bg-academic-50 dark:bg-academic-800/40 border-academic-200 dark:border-academic-700 text-academic-800 dark:text-academic-200 hover:border-academic-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`student-q-${q.id}`}
                                checked={studentAnswers[q.id] === oIdx}
                                onChange={() => handleStudentAnswerChange(q.id, oIdx)}
                                className="text-primary-600"
                              />
                              <span className="text-xs sm:text-sm">{String.fromCharCode(65 + oIdx)}. {opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.format === 'true_false' && (
                        <div className="flex items-center gap-4">
                          {[
                            { label: 'True', val: 0 },
                            { label: 'False', val: 1 }
                          ].map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => handleStudentAnswerChange(q.id, item.val)}
                              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                studentAnswers[q.id] === item.val
                                  ? 'bg-primary-600 text-white shadow-xs'
                                  : 'bg-academic-100 dark:bg-academic-800 text-academic-700 dark:text-academic-300'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {q.format === 'fill_blank' && (
                        <div>
                          <label className="text-xs text-academic-500 block mb-1">Enter Missing Term:</label>
                          <input
                            type="text"
                            value={studentAnswers[q.id] || ''}
                            onChange={(e) => handleStudentAnswerChange(q.id, e.target.value)}
                            placeholder="Type single word or phrase..."
                            className="w-full sm:w-96 px-4 py-2.5 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs sm:text-sm text-academic-900 dark:text-white focus:outline-none"
                          />
                        </div>
                      )}

                      {q.format === 'numerical' && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-xl bg-academic-50 dark:bg-academic-800/40 text-xs space-y-1 text-academic-700 dark:text-academic-300">
                            <div><strong>Given Data:</strong> {q.givenData}</div>
                            <div><strong>Formula:</strong> {q.formula}</div>
                          </div>
                          <div>
                            <label className="text-xs text-academic-500 block mb-1">Enter Final Calculated Value ({q.unit}):</label>
                            <input
                              type="number"
                              value={studentAnswers[q.id] || ''}
                              onChange={(e) => handleStudentAnswerChange(q.id, e.target.value)}
                              placeholder={`Numerical result in ${q.unit}...`}
                              className="w-full sm:w-72 px-4 py-2 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs font-mono font-bold text-academic-900 dark:text-white focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {(q.format === 'short_answer' || q.format === 'long_answer' || q.format === 'descriptive') && (
                        <div>
                          <label className="text-xs text-academic-500 block mb-1">Your Written Solution:</label>
                          <textarea
                            value={studentAnswers[q.id] || ''}
                            onChange={(e) => handleStudentAnswerChange(q.id, e.target.value)}
                            rows={q.format === 'descriptive' ? 6 : q.format === 'long_answer' ? 4 : 3}
                            placeholder="Formulate your response thoroughly with definitions, proofs, and structural breakdowns..."
                            className="w-full p-3.5 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs sm:text-sm text-academic-900 dark:text-white leading-relaxed focus:outline-none"
                          />
                        </div>
                      )}

                      {q.format === 'case_study' && q.subQuestions && (
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-academic-50 dark:bg-academic-800/40 text-xs leading-relaxed text-academic-800 dark:text-academic-200">
                            <strong>Case Scenario:</strong> {q.scenario}
                          </div>
                          {q.subQuestions.map((sq, sqIdx) => (
                            <div key={sqIdx} className="space-y-1.5 pl-3 border-l-2 border-primary-500">
                              <label className="text-xs font-bold text-academic-900 dark:text-white">
                                ({String.fromCharCode(97 + sqIdx)}) {sq.question} ({sq.marks} Marks)
                              </label>
                              <textarea
                                value={studentAnswers[`${q.id}-sub${sqIdx + 1}`] || ''}
                                onChange={(e) => handleStudentAnswerChange(`${q.id}-sub${sqIdx + 1}`, e.target.value)}
                                rows={3}
                                placeholder="Write engineering analysis..."
                                className="w-full p-3 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs text-academic-900 dark:text-white focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit CTA Bottom */}
              <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-800 flex items-center justify-between">
                <span className="text-xs text-academic-500">
                  Ready to complete your examination? Objective questions will be auto-graded instantly.
                </span>
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 cursor-pointer"
                >
                  Submit Examination
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: RESULTS & SCORE CARD */}
          {studentTab === 'results' && lastSubmissionResult && (
            <div className="space-y-6">
              {/* Score Summary Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-academic-900 via-primary-950 to-academic-900 text-white shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-300">
                      Official Assessment Evaluation
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      {lastSubmissionResult.paperTitle}
                    </h2>
                    <p className="text-xs text-academic-300 mt-1">
                      Candidate: {lastSubmissionResult.studentName} • Time Spent: {formatSeconds(lastSubmissionResult.timeSpentSeconds)}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-4xl font-extrabold text-emerald-400">
                      {lastSubmissionResult.totalScore} <span className="text-lg text-white">/ {lastSubmissionResult.totalPossibleMarks}</span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      {lastSubmissionResult.percentage}% Score
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-academic-800 text-xs">
                  <div className="p-3 rounded-xl bg-academic-800/60">
                    <span className="text-academic-400 block">Auto-Graded Objective:</span>
                    <strong className="text-emerald-400 text-sm">{lastSubmissionResult.autoGradedScore} / {lastSubmissionResult.maxObjectiveMarks} Marks</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-academic-800/60">
                    <span className="text-academic-400 block">Subjective Manual Review:</span>
                    <strong className="text-amber-400 text-sm">
                      {lastSubmissionResult.status === 'final_graded'
                        ? `${lastSubmissionResult.manualGradedScore} / ${lastSubmissionResult.maxSubjectiveMarks} Marks (Graded)`
                        : 'Pending Teacher Evaluation'}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-academic-800/60">
                    <span className="text-academic-400 block">Review Status:</span>
                    <strong className="text-white text-sm capitalize">{lastSubmissionResult.status.replace(/_/g, ' ')}</strong>
                  </div>
                </div>

                {lastSubmissionResult.teacherFeedback && (
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
                    <strong>Instructor Feedback:</strong> {lastSubmissionResult.teacherFeedback}
                  </div>
                )}
              </div>

              {/* Question by question feedback */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-academic-500">
                  Question-by-Question Solution & Feedback Review
                </h3>

                {lastSubmissionResult.questionResults && Object.entries(lastSubmissionResult.questionResults).map(([qid, res], idx) => (
                  <div
                    key={qid}
                    className={`p-5 rounded-2xl bg-white dark:bg-academic-900 border text-xs space-y-2 ${
                      res.isCorrect === true
                        ? 'border-emerald-300 dark:border-emerald-800'
                        : res.isCorrect === false
                        ? 'border-red-300 dark:border-red-800'
                        : 'border-academic-200 dark:border-academic-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-academic-900 dark:text-white">
                        Question #{idx + 1} ({qid})
                      </span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        res.isCorrect === true
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : res.isCorrect === false
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-academic-100 text-academic-700 dark:bg-academic-800 dark:text-academic-300'
                      }`}>
                        Awarded: {res.awardedMarks} / {res.maxMarks} Marks
                      </span>
                    </div>

                    <div className="text-academic-700 dark:text-academic-300">
                      <strong>Your Answer:</strong> {String(lastSubmissionResult.answers[qid] ?? 'No answer provided')}
                    </div>

                    {res.explanation && (
                      <div className="p-3 rounded-xl bg-academic-50 dark:bg-academic-800/50 text-academic-600 dark:text-academic-400">
                        <strong>Explanation:</strong> {res.explanation}
                      </div>
                    )}

                    {res.feedback && (
                      <div className="text-primary-600 dark:text-primary-400 font-medium">
                        <strong>Evaluation Note:</strong> {res.feedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TEACHER EVALUATION MODAL */}
      {/* ===================================================================== */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-800 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-academic-200 dark:border-academic-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-academic-900 dark:text-white">
                  Instructor Grading Studio: {gradingSubmission.studentName}
                </h3>
                <p className="text-xs text-academic-500">
                  {gradingSubmission.paperTitle} • Auto-Graded Objective: {gradingSubmission.autoGradedScore} / {gradingSubmission.maxObjectiveMarks}
                </p>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="text-academic-400 hover:text-academic-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar text-xs">
              <div className="p-3 rounded-xl bg-primary-50/70 dark:bg-primary-950/40 border border-primary-200 text-primary-800 dark:text-primary-200">
                Objective questions (MCQ, True/False, Blanks) are already auto-graded. Below are subjective solutions requiring instructor review.
              </div>

              {gradingSubmission.questionResults && Object.entries(gradingSubmission.questionResults).map(([qid, res]) => (
                <div key={qid} className="p-4 rounded-xl border border-academic-200 dark:border-academic-700 space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span>Question ID: {qid} (Max: {res.maxMarks} Marks)</span>
                    <div className="flex items-center gap-2">
                      <span>Award Marks:</span>
                      <input
                        type="number"
                        min={0}
                        max={res.maxMarks}
                        value={manualGrades[qid] ?? res.awardedMarks}
                        onChange={(e) => setManualGrades({ ...manualGrades, [qid]: Number(e.target.value) })}
                        className="w-16 px-2 py-1 rounded bg-academic-100 dark:bg-academic-800 border text-center font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <strong>Student Response:</strong>
                    <p className="mt-1 p-2 rounded bg-academic-50 dark:bg-academic-800 text-academic-800 dark:text-academic-200 leading-relaxed font-mono">
                      {gradingSubmission.answers[qid] || 'No submission recorded'}
                    </p>
                  </div>

                  {res.modelAnswer && (
                    <div className="text-academic-500">
                      <strong>Model Answer Reference:</strong> {res.modelAnswer}
                    </div>
                  )}
                </div>
              ))}

              <div>
                <label className="font-bold text-academic-700 dark:text-academic-300 block mb-1">
                  Instructor Feedback & Recommendations:
                </label>
                <textarea
                  value={teacherFeedbackText}
                  onChange={(e) => setTeacherFeedbackText(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-academic-200 dark:border-academic-800 flex items-center justify-between bg-academic-50 dark:bg-academic-950/40">
              <span className="text-xs text-academic-500">
                Calculated Final Total: {gradingSubmission.autoGradedScore + Object.values(manualGrades).reduce((a, b) => a + b, 0)} / {gradingSubmission.totalPossibleMarks}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-academic-600 hover:bg-academic-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGrade}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
                >
                  Finalize & Publish Grades
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* STUDENT SUBMISSION CONFIRMATION MODAL */}
      {/* ===================================================================== */}
      {showSubmitConfirm && activeTestPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-academic-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              <span>Confirm Exam Submission</span>
            </h3>

            <p className="text-xs text-academic-600 dark:text-academic-400 leading-relaxed">
              You have answered <strong>{Object.keys(studentAnswers).length}</strong> out of <strong>{activeTestPaper.questions.length}</strong> questions.
              Time remaining: <strong>{formatSeconds(testTimeRemaining)}</strong>.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-academic-600 hover:bg-academic-100"
              >
                Keep Reviewing
              </button>
              <button
                onClick={handleSubmitTest}
                disabled={isSubmittingTest}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30"
              >
                {isSubmittingTest ? 'Grading Answers...' : 'Yes, Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* OFFICIAL EXAM PRINT / PREVIEW MODAL */}
      {/* ===================================================================== */}
      {previewPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-800 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-academic-200 dark:border-academic-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-academic-500">Official Question Paper Preview</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-academic-100 dark:bg-academic-800 hover:bg-academic-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Paper</span>
                </button>
                <button onClick={() => setPreviewPaper(null)} className="text-academic-400 hover:text-academic-700 text-sm font-bold">
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar text-academic-900 dark:text-academic-100 font-serif">
              {/* University Header */}
              <div className="text-center border-b-2 border-academic-900 dark:border-academic-100 pb-4 space-y-1">
                <h2 className="text-xl font-bold tracking-tight uppercase">Faculty of Artificial Intelligence & Engineering</h2>
                <h3 className="text-sm font-semibold uppercase">{previewPaper.examType}</h3>
                <h4 className="text-sm font-bold">{previewPaper.title}</h4>
                <div className="flex items-center justify-between text-xs pt-2 font-sans font-semibold">
                  <span>Course: {previewPaper.course}</span>
                  <span>Time Allowed: {previewPaper.durationMinutes} Minutes</span>
                  <span>Maximum Marks: {previewPaper.totalMarks}</span>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-xs font-sans space-y-1 p-3 rounded-xl bg-academic-50 dark:bg-academic-800">
                <strong>Instructions to Candidates:</strong>
                <ul className="list-disc pl-5 space-y-0.5">
                  {previewPaper.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>

              {/* Questions */}
              <div className="space-y-6 font-sans">
                {previewPaper.questions.map((q, idx) => (
                  <div key={q.id} className="text-xs sm:text-sm space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <strong>Q{idx + 1}.</strong> {q.question}
                      </div>
                      <span className="font-bold shrink-0">[{q.marks} Marks]</span>
                    </div>

                    {q.format === 'mcq' && q.options && (
                      <div className="grid grid-cols-2 gap-2 pl-4 text-xs font-normal">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx}>({String.fromCharCode(65 + oIdx)}) {opt}</div>
                        ))}
                      </div>
                    )}

                    {q.format === 'case_study' && q.subQuestions && (
                      <div className="pl-4 space-y-1.5 text-xs">
                        {q.subQuestions.map((sq, sqIdx) => (
                          <div key={sqIdx} className="flex justify-between">
                            <span>({String.fromCharCode(97 + sqIdx)}) {sq.question}</span>
                            <span className="font-semibold">[{sq.marks} M]</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
