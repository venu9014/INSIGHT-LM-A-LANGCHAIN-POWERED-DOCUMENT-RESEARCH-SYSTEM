import React, { useState } from 'react';
import {
  GraduationCap,
  School,
  Microscope,
  BookOpen,
  CheckCircle2,
  Sparkles,
  FileText,
  Bookmark,
  Layers,
  ArrowRight,
  Download,
  Copy,
  Check,
  Code2,
  Terminal,
  Cpu,
  HelpCircle,
  Award,
  ListOrdered,
  FileCode,
  Presentation,
  Sliders,
  Compass
} from 'lucide-react';
import { UserRole, DocumentItem } from '../../types';

interface RoleHubViewProps {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  documents: DocumentItem[];
  onNavigateTab: (tab: any) => void;
}

export const RoleHubView: React.FC<RoleHubViewProps> = ({
  currentRole,
  onSwitchRole,
  documents,
  onNavigateTab
}) => {
  const [activeHubRole, setActiveHubRole] = useState<UserRole>(currentRole);
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || 'doc-1');
  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  // Interactive Tools State
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeVivaQuestion, setActiveVivaQuestion] = useState<number | null>(0);
  const [showVivaAnswer, setShowVivaAnswer] = useState<boolean>(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const studentVivaQuestions = [
    {
      q: 'Why is the scaling factor 1/√d_k indispensable in Scaled Dot-Product Attention?',
      a: 'For large values of d_k (e.g. d_k=64 in base Transformer), the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients (gradient vanishing). Dividing by √d_k scales the variance back to 1.0, ensuring stable backpropagation.'
    },
    {
      q: 'How does Multi-Head Attention maintain the same computational cost as Single-Head Attention?',
      a: 'Instead of computing attention once with full d_model dimensions, Multi-Head Attention projects Q, K, and V into h parallel heads with reduced dimension d_k = d_model / h. For h=8 and d_model=512, each head computes attention on d_k=64. The total matrix multiplication FLOPs across all heads remain identical to single-head attention with d_model=512!'
    },
    {
      q: 'Explain the difference between RAG-Sequence and RAG-Token probabilistic models.',
      a: 'RAG-Sequence assumes the same retrieved document passage generates the entire sequence, summing probabilities across top-k passages at the sequence level. RAG-Token allows different document passages to condition each individual token, enabling multi-document synthesis within a single sentence.'
    },
    {
      q: 'What is the theoretical time complexity of HNSW vector search in ChromaDB compared to exhaustive search?',
      a: 'Exhaustive Flat search requires O(N · d) comparisons where N is total corpus chunks. Hierarchical Navigable Small World (HNSW) graphs maintain multi-layer skip-lists achieving O(log N · d) search complexity with 95-98% Recall@10, providing sub-15ms queries across 100,000 vectors.'
    }
  ];

  const pytorchAttentionCode = `import torch
import torch.nn as nn
import math

class ScaledDotProductAttention(nn.Module):
    """
    Core Scaled Dot-Product Attention from Vaswani et al. (Section 3.2)
    Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V
    """
    def __init__(self, d_k: int, dropout: float = 0.1):
        super().__init__()
        self.scale = 1.0 / math.sqrt(d_k)
        self.dropout = nn.Dropout(dropout)
        self.softmax = nn.Softmax(dim=-1)

    def forward(self, q: torch.Tensor, k: torch.Tensor, v: torch.Tensor, mask: torch.Tensor = None):
        # Tensor Shapes:
        # q: [batch_size, num_heads, seq_len_q, d_k]
        # k: [batch_size, num_heads, seq_len_k, d_k]
        # v: [batch_size, num_heads, seq_len_v, d_v]
        
        # 1. Compute raw affinity dot products (MatMul)
        scores = torch.matmul(q, k.transpose(-2, -1)) * self.scale  # [batch, heads, seq_q, seq_k]
        
        # 2. Apply optional causal or padding mask
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
            
        # 3. Softmax activation to obtain normalized attention weights
        attention_weights = self.softmax(scores)
        attention_weights = self.dropout(attention_weights)
        
        # 4. Multiply by Value vectors
        output = torch.matmul(attention_weights, v)  # [batch, heads, seq_q, d_v]
        return output, attention_weights`;

  const latexEquations = `% Scaled Dot-Product Attention Formulation
\\begin{equation}
\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V
\\end{equation}

% Multi-Head Attention Linear Projections
\\begin{equation}
\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)W^O
\\quad \\text{where} \\quad \\text{head}_i = \\text{Attention}(QW_i^Q, KW_i^K, VW_i^V)
\\end{equation}

% Dense Passage Retrieval (DPR) Cosine Scoring
\\begin{equation}
\\text{sim}(q, d) = \\frac{\\mathbf{E}_Q(q) \\cdot \\mathbf{E}_D(d)}{\\|\\mathbf{E}_Q(q)\\|_2 \\|\\mathbf{E}_D(d)\\|_2}
\\end{equation}`;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-academic-900 dark:text-white flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <span>Academic Persona Hub & Exclusive Feature Suites</span>
          </h2>
          <p className="text-xs text-academic-500 dark:text-academic-400 mt-1">
            Dedicated specialized tools designed strictly for engineering students, classroom professors, and academic researchers.
          </p>
        </div>

        {/* 1-Click Role Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-800 shadow-2xs">
          {(['Student', 'Teacher', 'Researcher'] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => {
                setActiveHubRole(role);
                onSwitchRole(role);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeHubRole === role
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-academic-600 dark:text-academic-400 hover:bg-academic-100 dark:hover:bg-academic-800'
              }`}
            >
              {role === 'Student' && <GraduationCap className="h-4 w-4" />}
              {role === 'Teacher' && <School className="h-4 w-4" />}
              {role === 'Researcher' && <Microscope className="h-4 w-4" />}
              <span>{role} Suite</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target Document Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-academic-700 dark:text-academic-300">
          <BookOpen className="h-4 w-4 text-primary-500" />
          <span>Active Context Paper:</span>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="px-3 py-1 rounded-lg bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs font-bold text-academic-900 dark:text-white"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                📄 {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('assessment')}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Generate Exam Paper & Quiz</span>
          </button>

          <button
            onClick={() => onNavigateTab('assistant')}
            className="px-4 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ask in Assistant</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          1. EXCLUSIVE ENGINEERING STUDENT SUITE
         ========================================================================= */}
      {activeHubRole === 'Student' && (
        <div className="space-y-6 select-text">
          {/* Top Quick Stats for Engineering Students */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-2xs space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5" />
                <span>Computational Complexity</span>
              </span>
              <h4 className="text-sm font-bold text-academic-900 dark:text-white">
                O(1) Sequential Path Length
              </h4>
              <p className="text-xs text-academic-600 dark:text-academic-300 leading-relaxed font-sans">
                Self-attention connects any two tokens in 1 operation. In RNNs, maximum path length is O(n), causing vanishing gradients over sequence length n.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-2xs space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary-600 flex items-center gap-1">
                <Terminal className="h-3.5 w-3.5" />
                <span>Tensor Dimensions</span>
              </span>
              <h4 className="text-sm font-bold text-academic-900 dark:text-white">
                d_model = 512, h = 8 Heads
              </h4>
              <div className="p-2 rounded bg-academic-50 dark:bg-academic-800 font-mono text-[11px] text-center font-bold text-primary-700 dark:text-primary-300">
                d_k = d_v = 512 / 8 = 64
              </div>
              <p className="text-[11px] text-academic-500">
                Feed-Forward hidden dimension d_ff = 2048 (4× expansion).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-2xs space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1">
                <Award className="h-3.5 w-3.5" />
                <span>Empirical SOTA</span>
              </span>
              <h4 className="text-sm font-bold text-academic-900 dark:text-white">
                28.4 BLEU on WMT 2014 En-De
              </h4>
              <p className="text-xs text-academic-600 dark:text-academic-300 leading-relaxed font-sans">
                Trained in 3.5 days on 8 P100 GPUs, saving over 85% training compute compared to recurrent ensemble baselines.
              </p>
            </div>
          </div>

          {/* Student Feature 1: Engineering Viva Voce Exam Trainer */}
          <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-academic-100 dark:border-academic-800">
              <div>
                <h3 className="text-base font-bold text-academic-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-emerald-600" />
                  <span>Engineering Viva Voce & Oral Defense Simulator</span>
                </h3>
                <p className="text-xs text-academic-500">
                  Interactive oral defense questions frequently asked by external university examiners.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                Question {(activeVivaQuestion ?? 0) + 1} of {studentVivaQuestions.length}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {studentVivaQuestions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveVivaQuestion(idx);
                      setShowVivaAnswer(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeVivaQuestion === idx
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-academic-100 dark:bg-academic-800 text-academic-700 dark:text-academic-300 hover:bg-academic-200'
                    }`}
                  >
                    Viva Q{idx + 1}
                  </button>
                ))}
              </div>

              {activeVivaQuestion !== null && (
                <div className="p-5 rounded-xl bg-academic-50/70 dark:bg-academic-800/40 border border-academic-200/70 dark:border-academic-750 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="h-6 w-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      ?
                    </span>
                    <h4 className="text-sm font-bold text-academic-900 dark:text-white leading-relaxed">
                      {studentVivaQuestions[activeVivaQuestion].q}
                    </h4>
                  </div>

                  {!showVivaAnswer ? (
                    <div className="pl-9 pt-2">
                      <button
                        onClick={() => setShowVivaAnswer(true)}
                        className="px-4 py-2 rounded-xl bg-white dark:bg-academic-900 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Reveal Technical Model Answer</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pl-9 pt-2 space-y-2">
                      <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs text-academic-800 dark:text-academic-200 leading-relaxed font-serif">
                        <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-1">
                          Standard Examiner Answer:
                        </span>
                        {studentVivaQuestions[activeVivaQuestion].a}
                      </div>
                      <button
                        onClick={() => setShowVivaAnswer(false)}
                        className="text-[11px] text-academic-400 hover:text-academic-600 underline cursor-pointer"
                      >
                        Hide Answer
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Student Feature 2: PyTorch Engineering Implementation Playground */}
          <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-academic-100 dark:border-academic-800">
              <div>
                <h3 className="text-base font-bold text-academic-900 dark:text-white flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary-600" />
                  <span>PyTorch Architectural Implementation (Clean Reference Code)</span>
                </h3>
                <p className="text-xs text-academic-500">
                  Executable PyTorch module implementing scaled dot-product attention with tensor dimensional annotations.
                </p>
              </div>

              <button
                onClick={() => handleCopy(pytorchAttentionCode, 'pytorch')}
                className="px-3.5 py-1.5 rounded-xl border border-academic-200 dark:border-academic-700 hover:bg-academic-100 text-xs font-bold text-academic-700 dark:text-academic-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'pytorch' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'pytorch' ? 'Copied Code!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-academic-950 border border-academic-800 text-xs font-mono">
              <div className="px-4 py-2 bg-academic-900/80 border-b border-academic-800 text-[11px] text-academic-400 flex items-center justify-between">
                <span>scaled_dot_product_attention.py</span>
                <span>PyTorch 2.x • CUDA Compatible</span>
              </div>
              <pre className="p-4 text-primary-300 overflow-x-auto custom-scrollbar leading-relaxed">
                {pytorchAttentionCode}
              </pre>
            </div>
          </div>

          {/* Student Feature 3: Hands-on Lab Assignment Generator */}
          <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-academic-900 dark:text-white flex items-center gap-2">
              <FileCode className="h-5 w-5 text-indigo-600" />
              <span>B.Tech / M.Tech AI Lab Assignment: {selectedDoc.name}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/70 dark:border-academic-750 space-y-2">
                <span className="font-bold text-primary-600 uppercase text-[10px] tracking-wider">
                  Exercise 1: Matrix Multiplication Proof
                </span>
                <p className="text-academic-700 dark:text-academic-300 leading-relaxed font-sans">
                  Implement custom self-attention from scratch without using <code className="font-mono text-primary-600">torch.nn.MultiheadAttention</code>. Verify that output tensor shape matches <code className="font-mono text-primary-600">[batch, seq_len, d_model]</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/70 dark:border-academic-750 space-y-2">
                <span className="font-bold text-emerald-600 uppercase text-[10px] tracking-wider">
                  Exercise 2: Softmax Saturation Benchmark
                </span>
                <p className="text-academic-700 dark:text-academic-300 leading-relaxed font-sans">
                  Plot the gradients of the attention weights as key dimension d_k increases from 16 to 1024. Show mathematically why scaling by 1 / √d_k preserves non-zero gradients.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/70 dark:border-academic-750 space-y-2">
                <span className="font-bold text-amber-600 uppercase text-[10px] tracking-wider">
                  Exercise 3: ChromaDB Vector Graph Ingestion
                </span>
                <p className="text-academic-700 dark:text-academic-300 leading-relaxed font-sans">
                  Chunk <code className="font-mono">{selectedDoc.name}</code> into 512-token segments with 10% overlap. Index passages using ChromaDB and measure cosine retrieval query latency in milliseconds.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/70 dark:border-academic-750 space-y-2">
                <span className="font-bold text-purple-600 uppercase text-[10px] tracking-wider">
                  Exercise 4: Grounded Hallucination Audit
                </span>
                <p className="text-academic-700 dark:text-academic-300 leading-relaxed font-sans">
                  Compare 5 answers generated by an ungrounded language model against this RAG assistant. Verify page coordinates and calculate the factual verification rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. EXCLUSIVE PROFESSOR / TEACHER SUITE
         ========================================================================= */}
      {activeHubRole === 'Teacher' && (
        <div className="space-y-6 select-text">
          {/* Teacher Feature 1: Course Syllabus & ABET/NAAC Outcome Planner */}
          <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-academic-100 dark:border-academic-800">
              <div>
                <h3 className="text-base font-bold text-academic-900 dark:text-white flex items-center gap-2">
                  <School className="h-5 w-5 text-indigo-600" />
                  <span>University Curriculum Unit Mapping ({selectedDoc.name})</span>
                </h3>
                <p className="text-xs text-academic-500">
                  Maps literature to standard 4-week postgraduate/undergraduate AI course modules.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
                Outcome-Based Education (OBE)
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/70 dark:border-academic-750 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-academic-900 dark:text-white block text-xs sm:text-sm">
                    Module 1: Sequence Modeling & Recurrent Bottlenecks
                  </span>
                  <p className="text-academic-500 text-[11px] mt-0.5">
                    Covers LSTM cell architectures, vanishing/exploding gradients, and $O(n)$ sequential step dependency.
                  </p>
                </div>
                <span className="px-2 py-1 rounded bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-700 font-mono text-[10px] font-bold shrink-0">
                  CO-1 (Cognitive Level 3)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/70 dark:border-academic-750 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-academic-900 dark:text-white block text-xs sm:text-sm">
                    Module 2: Scaled Dot-Product & Multi-Head Self-Attention
                  </span>
                  <p className="text-academic-500 text-[11px] mt-0.5">
                    Mathematical derivation of softmax(QK^T / √d_k)V, positional encodings, and linear projection heads.
                  </p>
                </div>
                <span className="px-2 py-1 rounded bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-700 font-mono text-[10px] font-bold shrink-0">
                  CO-2 (Cognitive Level 4)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/70 dark:border-academic-750 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-academic-900 dark:text-white block text-xs sm:text-sm">
                    Module 3: Retrieval-Augmented Generation & Vector Databases
                  </span>
                  <p className="text-academic-500 text-[11px] mt-0.5">
                    HNSW graph indexing in ChromaDB, dense passage retrieval (DPR), cosine similarity, and hallucination reduction.
                  </p>
                </div>
                <span className="px-2 py-1 rounded bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-700 font-mono text-[10px] font-bold shrink-0">
                  CO-3 (Cognitive Level 5)
                </span>
              </div>
            </div>
          </div>

          {/* Teacher Feature 2: Lecture Slide Deck Outliner */}
          <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-academic-900 dark:text-white flex items-center gap-2">
              <Presentation className="h-5 w-5 text-indigo-600" />
              <span>Classroom Slide Deck Outliner (Ready for PowerPoint / LaTeX Beamer)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/70 dark:border-academic-750 space-y-2">
                <span className="font-bold font-mono text-indigo-600 text-[11px] block">SLIDE 1: MOTIVATION</span>
                <p className="font-bold text-academic-900 dark:text-white">Why RNNs Failed to Scale</p>
                <ul className="text-academic-600 dark:text-academic-300 list-disc pl-4 space-y-1 text-[11px]">
                  <li>Sequential computation constraint</li>
                  <li>Inability to parallelize on NVIDIA GPUs</li>
                  <li>Long-distance contextual degradation</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/70 dark:border-academic-750 space-y-2">
                <span className="font-bold font-mono text-indigo-600 text-[11px] block">SLIDE 2: THE BREAKTHROUGH</span>
                <p className="font-bold text-academic-900 dark:text-white">Attention Is All You Need</p>
                <ul className="text-academic-600 dark:text-academic-300 list-disc pl-4 space-y-1 text-[11px]">
                  <li>Query, Key, Value library metaphor</li>
                  <li>Constant O(1) path length</li>
                  <li>Full tensor parallelization</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-academic-50 dark:bg-academic-800/40 border border-academic-200/70 dark:border-academic-750 space-y-2">
                <span className="font-bold font-mono text-indigo-600 text-[11px] block">SLIDE 3: GROUNDED EVIDENCE</span>
                <p className="font-bold text-academic-900 dark:text-white">RAG vs Static Memory</p>
                <ul className="text-academic-600 dark:text-academic-300 list-disc pl-4 space-y-1 text-[11px]">
                  <li>Parametric weights are frozen</li>
                  <li>Non-parametric ChromaDB indexing</li>
                  <li>Auditable page-level citations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Teacher Feature 3: Grading Rubric & Assessment Matrix */}
          <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-academic-900 dark:text-white">
              Standard Student Assessment Rubric (20 Marks Total)
            </h3>
            <div className="overflow-x-auto custom-scrollbar text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-academic-200 dark:border-academic-800 text-[11px] uppercase font-bold text-academic-400">
                    <th className="py-2">Dimension</th>
                    <th className="py-2">Poor (0-2 Marks)</th>
                    <th className="py-2">Adequate (3 Marks)</th>
                    <th className="py-2">Exemplary (4-5 Marks)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-academic-100 dark:divide-academic-800 text-academic-700 dark:text-academic-300">
                  <tr>
                    <td className="py-2.5 font-bold">Mathematical Rigor</td>
                    <td>Vague formulas; no explanation of √d_k.</td>
                    <td>Correct equation with minor notation omissions.</td>
                    <td>Full derivation with tensor dimensions and gradient scaling proof.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Vector Ingestion (RAG)</td>
                    <td>Failed to configure chunk size or overlap.</td>
                    <td>Basic chunking with uncalibrated cosine threshold.</td>
                    <td>Optimized 512 chunking with MMR re-ranking and page citation audit.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Oral Viva Defense</td>
                    <td>Cannot explain difference from RNNs.</td>
                    <td>Understands basic concepts but struggles with multi-head heads.</td>
                    <td>Confident, master-level defense with hardware and FLOP analysis.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. EXCLUSIVE SCIENTIFIC RESEARCHER SUITE
         ========================================================================= */}
      {activeHubRole === 'Researcher' && (
        <div className="space-y-6 select-text">
          {/* Researcher Feature 1: LaTeX Equation & BibTeX Exporter */}
          <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-academic-100 dark:border-academic-800">
              <div>
                <h3 className="text-base font-bold text-academic-900 dark:text-white flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-purple-600" />
                  <span>LaTeX Mathematical Formulations & Paper Snippets</span>
                </h3>
                <p className="text-xs text-academic-500">
                  Ready-to-paste LaTeX equations and mathematical proofs for your conference publication or manuscript.
                </p>
              </div>

              <button
                onClick={() => handleCopy(latexEquations, 'latex')}
                className="px-3.5 py-1.5 rounded-xl border border-academic-200 dark:border-academic-700 hover:bg-academic-100 text-xs font-bold text-academic-700 dark:text-academic-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'latex' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'latex' ? 'Copied LaTeX!' : 'Copy LaTeX'}</span>
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-academic-950 border border-academic-800 text-xs font-mono">
              <pre className="p-4 text-purple-300 overflow-x-auto custom-scrollbar leading-relaxed">
                {latexEquations}
              </pre>
            </div>
          </div>

          {/* Researcher Feature 2: Empirical Benchmark Matrix & Ablation Studies */}
          <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-academic-900 dark:text-white flex items-center gap-2">
              <Microscope className="h-5 w-5 text-purple-600" />
              <span>Ablation Study & SOTA Empirical Comparison Matrix</span>
            </h3>

            <div className="overflow-x-auto custom-scrollbar text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-academic-200 dark:border-academic-800 text-[11px] uppercase font-bold text-academic-400">
                    <th className="py-2">Architecture Variation</th>
                    <th className="py-2">Attention Heads (h)</th>
                    <th className="py-2">Key Dim (d_k)</th>
                    <th className="py-2">Parameters</th>
                    <th className="py-2">BLEU (En-De)</th>
                    <th className="py-2">Hardware Training Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-academic-100 dark:divide-academic-800 text-academic-700 dark:text-academic-300 font-mono">
                  <tr>
                    <td className="py-2.5 font-bold text-academic-900 dark:text-white">Transformer (Base)</td>
                    <td>8</td>
                    <td>64</td>
                    <td>65M</td>
                    <td className="font-bold text-emerald-600">27.3</td>
                    <td>12 hours (8 P100s)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-academic-900 dark:text-white">Transformer (Big)</td>
                    <td>16</td>
                    <td>64</td>
                    <td>213M</td>
                    <td className="font-bold text-emerald-600">28.4</td>
                    <td>3.5 days (8 P100s)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-academic-900 dark:text-white">Single-Head Attention (Ablation)</td>
                    <td>1</td>
                    <td>512</td>
                    <td>65M</td>
                    <td className="text-red-500">26.4 (-0.9 drop)</td>
                    <td>11.5 hours</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-academic-900 dark:text-white">Reduced Key Size (d_k=16)</td>
                    <td>32</td>
                    <td>16</td>
                    <td>65M</td>
                    <td className="text-amber-500">26.8 (-0.5 drop)</td>
                    <td>13 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Researcher Feature 3: Novel Grant & PhD Thesis Gap Finder */}
          <div className="p-6 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-academic-900 dark:text-white flex items-center gap-2">
              <Compass className="h-5 w-5 text-purple-600" />
              <span>Unsolved Research Gaps & Thesis Proposal Directions</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-900/50 space-y-1.5">
                <span className="font-bold text-purple-900 dark:text-purple-200 block text-xs sm:text-sm">
                  1. Multi-Hop Reasoning Across Disjoint Scientific Appendices
                </span>
                <p className="text-academic-700 dark:text-academic-300 leading-relaxed font-sans">
                  Current dense retrieval identifies single relevant passages independently. When a mathematical lemma in Appendix C depends on an assumption in Section 2, single-hop cosine lookup fails. Research opportunity: Developing graph-augmented iterative retrieval chains.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/70 dark:border-purple-900/50 space-y-1.5">
                <span className="font-bold text-purple-900 dark:text-purple-200 block text-xs sm:text-sm">
                  2. Hallucination Boundary Verification via Formal Theorem Provers
                </span>
                <p className="text-academic-700 dark:text-academic-300 leading-relaxed font-sans">
                  Language models predict tokens probabilistically without symbolic verification. Research opportunity: Coupling Lean 4 / Isabelle theorem provers with generative decoding loops to formally audit mathematical correctness.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
