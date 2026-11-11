import { DocumentItem, ChatMessage, CitationItem, SummaryResult, LearningVideoProject, YouTubeResearchResult, HistoryItem, SavedItem, UserProfile, SampleAccountCredential } from '../types';

export const sampleIndianAccounts: SampleAccountCredential[] = [
  {
    name: 'Aarav Sharma',
    role: 'Student',
    email: 'aarav.sharma@research.edu.in',
    username: 'aarav_student',
    passwordHint: 'Aarav#Student2026',
    institution: 'Indian Institute of Technology (IIT) Delhi',
    department: 'Department of Computer Science & Engineering',
    avatar: 'AS',
    bio: 'B.Tech CSE student researching multi-head attention and transformer representations.'
  },
  {
    name: 'Priya Patel',
    role: 'Student',
    email: 'priya.patel@research.edu.in',
    username: 'priya_student',
    passwordHint: 'Priya#Student2026',
    institution: 'BITS Pilani',
    department: 'School of Computing & Artificial Intelligence',
    avatar: 'PP',
    bio: 'Final year undergraduate working on retrieval-augmented generation benchmarks.'
  },
  {
    name: 'Prof. Rahul Verma',
    role: 'Teacher',
    email: 'rahul.verma@faculty.edu.in',
    username: 'rahul_prof',
    passwordHint: 'Rahul#Teacher2026',
    institution: 'Indian Institute of Technology (IIT) Bombay',
    department: 'Department of Electrical Engineering & Artificial Intelligence',
    avatar: 'RV',
    bio: 'Associate Professor lecturing CS-804: Neural Representation Learning.'
  },
  {
    name: 'Prof. Sneha Iyer',
    role: 'Teacher',
    email: 'sneha.iyer@faculty.edu.in',
    username: 'sneha_prof',
    passwordHint: 'Sneha#Teacher2026',
    institution: 'Indian Institute of Science (IISc) Bangalore',
    department: 'Division of EECS',
    avatar: 'SI',
    bio: 'Professor and Head of Natural Language Processing Pedagogy.'
  },
  {
    name: 'Dr. Arjun Reddy',
    role: 'Researcher',
    email: 'arjun.reddy@lab.edu.in',
    username: 'arjun_research',
    passwordHint: 'Arjun#Research2026',
    institution: 'Indian Institute of Technology (IIT) Madras',
    department: 'Centre for Data Science & AI (RBC-DSAI)',
    avatar: 'AR',
    bio: 'Principal Research Scientist specializing in HNSW graph traversal and vector indexing.'
  },
  {
    name: 'Dr. Ananya Nair',
    role: 'Researcher',
    email: 'ananya.nair@lab.edu.in',
    username: 'ananya_research',
    passwordHint: 'Ananya#Research2026',
    institution: 'IIIT Hyderabad',
    department: 'Language Technologies Research Centre',
    avatar: 'AN',
    bio: 'Postdoctoral Research Fellow investigating hallucination mitigation in RAG.'
  }
];

export const demoProfiles: Record<string, UserProfile> = {
  Student: {
    id: 'usr-aarav-sharma',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@research.edu.in',
    username: 'aarav_student',
    role: 'Student',
    avatar: 'AS',
    institution: 'Indian Institute of Technology (IIT) Delhi',
    department: 'Department of Computer Science & Engineering',
    bio: 'B.Tech CSE student researching multi-head attention and transformer representations.'
  },
  Teacher: {
    id: 'usr-rahul-verma',
    name: 'Prof. Rahul Verma',
    email: 'rahul.verma@faculty.edu.in',
    username: 'rahul_prof',
    role: 'Teacher',
    avatar: 'RV',
    institution: 'Indian Institute of Technology (IIT) Bombay',
    department: 'Department of Electrical Engineering & Artificial Intelligence',
    bio: 'Associate Professor lecturing CS-804: Neural Representation Learning.'
  },
  Researcher: {
    id: 'usr-arjun-reddy',
    name: 'Dr. Arjun Reddy',
    email: 'arjun.reddy@lab.edu.in',
    username: 'arjun_research',
    role: 'Researcher',
    avatar: 'AR',
    institution: 'Indian Institute of Technology (IIT) Madras',
    department: 'Centre for Data Science & AI (RBC-DSAI)',
    bio: 'Principal Research Scientist specializing in HNSW graph traversal and vector indexing.'
  }
};

export const sampleInsights = {
  keyTopics: [
    { name: 'Self-Attention & Transformers', percentage: 38, count: 24 },
    { name: 'Retrieval-Augmented Generation', percentage: 28, count: 18 },
    { name: 'Vector Indexing & ChromaDB', percentage: 16, count: 10 },
    { name: 'Hallucination Mitigation', percentage: 12, count: 8 },
    { name: 'Cross-Encoder Re-ranking', percentage: 6, count: 4 },
  ],
  trends: [
    { year: '2021', publications: 14, citations: 280 },
    { year: '2022', publications: 28, citations: 650 },
    { year: '2023', publications: 52, citations: 1420 },
    { year: '2024', publications: 89, citations: 2980 },
    { year: '2025-26', publications: 134, citations: 4620 },
  ],
  methodologies: [
    { name: 'Multi-Head Self-Attention', category: 'Architecture', adoption: '92%' },
    { name: 'Dense Passage Retrieval (DPR)', category: 'Retrieval', adoption: '78%' },
    { name: 'Maximum Marginal Relevance (MMR)', category: 'Re-Ranking', adoption: '65%' },
    { name: 'Contrastive Pre-training', category: 'Embedding', adoption: '84%' },
    { name: 'HNSW Graph Indexing', category: 'Vector Search', adoption: '89%' },
  ],
  frequentlyMentionedConcepts: [
    { tag: 'Cosine Similarity', count: 64 },
    { tag: 'Context Window', count: 52 },
    { tag: 'ChromaDB Embeddings', count: 48 },
    { tag: 'Grounded Retrieval', count: 45 },
    { tag: 'BLEU & ROUGE Score', count: 39 },
    { tag: 'Cross-Attention', count: 34 },
    { tag: 'Zero-Shot Prompting', count: 29 },
  ],
  researchGaps: [
    {
      title: 'Dynamic Chunk Sizing for Multi-Modal RAG',
      description: 'Fixed-token chunking often fractures complex tables and equations; content-aware chunking remains an active open research challenge.'
    },
    {
      title: 'Iterative Reasoning Loops in Dense Vector Retrieval',
      description: 'Single-hop retrieval fails for complex multi-hop academic queries requiring sequential reasoning across disjoint paper chapters.'
    },
    {
      title: 'Hallucination Boundary Verification in Scientific Citations',
      description: 'Developing automated mathematical verifiers to ensure generated formulas strictly correspond to source theorem proofs.'
    }
  ]
};

export const initialDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    sourceId: 'SRC-TRANSFORMER-2017',
    name: 'Transformer_Architecture.pdf',
    type: 'Research Papers',
    pages: 28,
    uploadedAt: 'Today, 08:30 AM',
    status: 'Indexed',
    size: '2.4 MB',
    authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit',
    year: 2017,
    doi: '10.48550/arXiv.1706.03762',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies.',
    tags: ['Transformers', 'Self-Attention', 'NLP', 'Deep Learning'],
    chunksCount: 142,
    pageContent: [
      {
        pageNumber: 1,
        text: 'Attention Is All You Need. Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin. Abstract: The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The proposed Transformer dispenses entirely with recurrence and convolutions.'
      },
      {
        pageNumber: 3,
        text: 'Section 3.1: Model Architecture. The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder. Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions.'
      },
      {
        pageNumber: 7,
        text: 'Section 3.2: Attention Mechanism Formulation. An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. In our proposed system, Scaled Dot-Product Attention computes Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V. Multi-head self-attention enables parallel computation across sequence tokens.'
      },
      {
        pageNumber: 12,
        text: 'Section 5: Training & Regularization. We trained on the standard WMT 2014 English-German dataset consisting of about 4.5 million sentence pairs. Sentences were encoded using byte-pair encoding, which has a shared source-target vocabulary of about 37000 tokens.'
      },
      {
        pageNumber: 24,
        text: 'Section 6.2: Model Variations. To evaluate the importance of different components of the Transformer, we varied our base model in different ways. Table 3 shows that reducing attention key size d_k hurts model quality and that single-head attention is 0.9 BLEU worse than the best setting with 8 heads.'
      }
    ]
  },
  {
    id: 'doc-2',
    sourceId: 'SRC-BERT-2018',
    name: 'BERT_Language_Representation.pdf',
    type: 'Research Papers',
    pages: 18,
    uploadedAt: 'Yesterday, 04:15 PM',
    status: 'Indexed',
    size: '1.8 MB',
    authors: 'Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova',
    year: 2018,
    doi: '10.48550/arXiv.1810.04805',
    abstract: 'We introduce BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context.',
    tags: ['Pre-training', 'Masked LM', 'Bidirectional', 'GLUE'],
    chunksCount: 96,
    pageContent: [
      {
        pageNumber: 1,
        text: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding. Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova. Language model pre-training has been shown to be effective for improving many natural language processing tasks.'
      },
      {
        pageNumber: 4,
        text: 'Section 3: BERT Pre-training Tasks. Task 1: Masked LM. In order to train a deep bidirectional representation, we simply mask some percentage of the input tokens at random, and then predict those masked tokens. Task 2: Next Sentence Prediction (NSP) captures inter-sentence relationships.'
      },
      {
        pageNumber: 8,
        text: 'Section 4: Experiments. We present BERT fine-tuning results on 11 NLP tasks. On the GLUE benchmark, BERT achieves 80.5% average accuracy, outperforming previous state-of-the-art models by a substantial margin.'
      }
    ]
  },
  {
    id: 'doc-3',
    sourceId: 'SRC-NLP-SURVEY-2023',
    name: 'NLP_Research_Survey.pdf',
    type: 'Research Papers',
    pages: 31,
    uploadedAt: '3 days ago',
    status: 'Indexed',
    size: '3.1 MB',
    authors: 'Sarah Chen, David M. Blei, Marcus R. Patel',
    year: 2023,
    doi: '10.1145/3547289.3547301',
    abstract: 'A systematic empirical survey exploring neural architectures in natural language processing from sequence-to-sequence models to modern transformer LLMs and retrieval-augmented generation paradigms.',
    tags: ['Survey', 'Evaluation', 'Foundational Models', 'RAG'],
    chunksCount: 184,
    pageContent: [
      {
        pageNumber: 1,
        text: 'Neural Architectures in NLP: From Recurrence to Retrieval-Augmented Generation. A Survey. Abstract: The evolution of NLP architectures has accelerated rapidly. This paper systematically categorizes autoregressive decoders, masked encoders, and hybrid retrieval-augmented generation architectures.'
      },
      {
        pageNumber: 12,
        text: 'Section 4.2: Retrieval Grounding and Hallucination Control. Table 4: Comparative evaluation demonstrates that retrieval-augmented methodologies consistently mitigate hallucination by 42% compared to pure parametric generation when grounding responses in dense vector repositories like ChromaDB.'
      }
    ]
  },
  {
    id: 'doc-4',
    sourceId: 'SRC-RAG-LEWIS-2020',
    name: 'RAG_Systematic_Review.pdf',
    type: 'Reports',
    pages: 22,
    uploadedAt: '4 days ago',
    status: 'Indexed',
    size: '2.1 MB',
    authors: 'Patrick Lewis, Ethan Perez, Aleksandara Piktus',
    year: 2020,
    doi: '10.48550/arXiv.2005.11401',
    abstract: 'Large pre-trained language models store factual knowledge in their parameters, but their ability to access precise knowledge and update factual representations remains limited. We present Retrieval-Augmented Generation (RAG) combining pre-trained parametric memory with non-parametric dense vector index.',
    tags: ['Retrieval Augmented Generation', 'Dense Passage Retrieval', 'Vector DB'],
    chunksCount: 118,
    pageContent: [
      {
        pageNumber: 2,
        text: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. We build RAG models where the parametric memory is a pre-trained seq2seq model and the non-parametric memory is a dense vector index of Wikipedia, accessed with a neural retriever.'
      },
      {
        pageNumber: 9,
        text: 'Section 4: Open Domain Question Answering. RAG-Sequence and RAG-Token models establish new state-of-the-art results on open-domain question answering benchmarks, outperforming parametric models that require 4x larger parameter footprints.'
      }
    ]
  },
  {
    id: 'doc-5',
    sourceId: 'SRC-VECTOR-NOTES-2024',
    name: 'Vector_Database_Indexing_Notes.pdf',
    type: 'Notes',
    pages: 12,
    uploadedAt: '5 days ago',
    status: 'Indexed',
    size: '940 KB',
    authors: 'Research Engineering Team',
    year: 2024,
    doi: 'Internal-TechNote-2024-03',
    abstract: 'Practical architectural benchmarks comparing HNSW, IVFPQ, and ScaNN vector indexing structures within ChromaDB and Milvus for high-dimensional cosine similarity search.',
    tags: ['ChromaDB', 'HNSW', 'Embeddings', 'Vector Search'],
    chunksCount: 64
  },
  {
    id: 'doc-6',
    sourceId: 'SRC-HALLUCINATION-2024',
    name: 'Hallucination_Mitigation_Techniques.pdf',
    type: 'Research Papers',
    pages: 26,
    uploadedAt: '1 week ago',
    status: 'Indexed',
    size: '2.6 MB',
    authors: 'Yue Zhang, Lei Li, Junying Chen',
    year: 2024,
    doi: '10.48550/arXiv.2309.01219',
    abstract: 'This survey presents a taxonomy of hallucination prevention techniques in generative models, categorizing approaches into training-time alignment, decoding interventions, and external retrieval augmentation.',
    tags: ['Hallucination', 'Factuality', 'Faithfulness', 'Alignment'],
    chunksCount: 130
  }
];

export const sampleYouTubeVideos: YouTubeResearchResult[] = [
  {
    id: 'yt-1',
    url: 'https://www.youtube.com/watch?v=wjZofJX0v4U',
    videoId: 'wjZofJX0v4U',
    title: 'Attention in transformers, visually explained | Chapter 6, Deep Learning',
    channel: '3Blue1Brown',
    duration: '26:45',
    thumbnailUrl: 'https://img.youtube.com/vi/wjZofJX0v4U/hqdefault.jpg',
    transcriptAvailable: true,
    analyzedAt: 'Today, 10:10 AM',
    summary: 'A pedagogical breakdown explaining why recurrent networks fail at long-range dependencies and how multi-head dot product attention allows direct token-to-token associative indexing in vector space.',
    keyTopics: [
      'Recurrent Sequential Bottlenecks',
      'Query, Key, and Value Metaphor',
      'Dot Product Scaling Factor',
      'Multi-Head Subspace Projections'
    ],
    importantPoints: [
      'In standard RNNs, information must travel step-by-step through intermediate hidden states, causing vanishing gradients.',
      'The attention mechanism replaces sequential state propagation with a direct matrix multiplier connecting all tokens.',
      'Dividing by the square root of key dimension prevents softmax saturation into areas with small gradients.'
    ],
    beginnerExplanation: 'Think of queries and keys like a library lookup system. The query is your search question, the key is the label on each book spine, and the value is the actual page content. By comparing your query to all keys at once, you instantly find the most relevant books without flipping through every shelf one by one.',
    transcriptText: 'Welcome to this visual exploration of attention in deep learning. For years, sequence modeling relied on recurrent neural networks like LSTMs. But LSTMs have a fundamental limitation: they process tokens one by one...',
    transcriptEntries: [
      { timestamp: '00:15', text: 'Welcome to this visual exploration of attention in deep learning.' },
      { timestamp: '02:45', text: 'Sequential recurrence creates a computational bottleneck that prevents parallel training.' },
      { timestamp: '06:12', text: 'The attention function computes dot products between queries and keys, normalized with softmax.' },
      { timestamp: '12:30', text: 'Multiple attention heads allow the model to learn different relational aspects simultaneously.' },
      { timestamp: '18:05', text: 'This visual intuition directly matches Section 3.2 of the original Vaswani et al. paper.' }
    ]
  },
  {
    id: 'yt-2',
    url: 'https://www.youtube.com/watch?v=T-D1OfcDW1M',
    videoId: 'T-D1OfcDW1M',
    title: 'Retrieval-Augmented Generation (RAG) Architecture Deep Dive',
    channel: 'IBM Technology',
    duration: '11:42',
    thumbnailUrl: 'https://img.youtube.com/vi/T-D1OfcDW1M/hqdefault.jpg',
    transcriptAvailable: true,
    analyzedAt: 'Yesterday, 02:30 PM',
    summary: 'An architectural examination of coupling vector databases (ChromaDB) with large language models through LangChain retrieval chains to achieve verifiable grounded generation.',
    keyTopics: [
      'Parametric vs Non-Parametric Memory',
      'Chunking and Overlap Strategies',
      'Dense Passage Retrieval (DPR)',
      'Hallucination Elimination'
    ],
    importantPoints: [
      'LLM weights are static and prone to hallucination when asked about proprietary or post-cutoff literature.',
      'RAG injects relevant text passages directly into the prompt context at inference time.',
      'Evaluation benchmarks show grounded RAG reduces factual errors by over 40% in technical question answering.'
    ],
    beginnerExplanation: 'Instead of taking an open-book exam entirely from memory, RAG is like having an assistant who runs to the library, finds the exact 3 pages you need, bookmarks them, and hands them to you right before you write down your answer.',
    transcriptText: 'Hello everyone. Today we are diving into Retrieval-Augmented Generation. When large language models generate answers, they rely on parametric memory frozen during pretraining. When we introduce a vector store like ChromaDB...',
    transcriptEntries: [
      { timestamp: '00:30', text: 'Introduction to parametric memory limitations in LLMs.' },
      { timestamp: '03:10', text: 'How vector databases chunk, embed, and index research documents using HNSW graphs.' },
      { timestamp: '06:45', text: 'The role of LangChain as the retrieval orchestrator between ChromaDB and the generative model.' },
      { timestamp: '09:20', text: 'Measuring hallucination reduction across scientific question-answering benchmarks.' }
    ]
  },
  {
    id: 'yt-3',
    url: 'https://www.youtube.com/watch?v=xI0HHN5XKDo',
    videoId: 'xI0HHN5XKDo',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    channel: 'Yannic Kilcher',
    duration: '38:12',
    thumbnailUrl: 'https://img.youtube.com/vi/xI0HHN5XKDo/hqdefault.jpg',
    transcriptAvailable: true,
    analyzedAt: '3 days ago',
    summary: 'Detailed paper breakdown explaining how bidirectional context extraction allows deeper contextual embeddings than unidirectional language models like GPT-1.',
    keyTopics: [
      'Masked Language Modeling (MLM)',
      'Next Sentence Prediction (NSP)',
      'Bidirectional Self-Attention',
      'Fine-Tuning on GLUE Benchmark'
    ],
    importantPoints: [
      'Standard language models are trained left-to-right, preventing them from looking ahead.',
      'BERT masks 15% of input tokens and trains the transformer encoder to predict the missing words using both past and future context.',
      'Achieved state-of-the-art scores across 11 NLP tasks upon release.'
    ],
    beginnerExplanation: 'Traditional language reading is like reading a sentence through a sliding peephole that only shows words you have already passed. BERT sees the whole sentence at once, covers a few words with a finger, and guesses what they were based on the clues around them.',
    transcriptText: 'Welcome to this paper review of BERT by Jacob Devlin et al. Today we will walk through the pre-training objectives...',
    transcriptEntries: [
      { timestamp: '01:00', text: 'Why unidirectional context limits representation capability.' },
      { timestamp: '08:20', text: 'Formulation of the Masked Language Model objective.' },
      { timestamp: '17:40', text: 'Next Sentence Prediction and input representations.' },
      { timestamp: '29:10', text: 'Fine-tuning results on GLUE, SQuAD, and MultiNLI.' }
    ]
  }
];

export const sampleChatHistory: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'What methodology is used in the proposed system?',
    timestamp: '10:14 AM'
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: `## Direct Answer
The investigated research documents establish that the system uses a **Retrieval-Augmented Generation (RAG)** pipeline combined with **Multi-Head Self-Attention**. Instead of relying on frozen memory, the model retrieves verified paragraphs from your paper and generates an accurate, step-by-step explanation.

## Simple Explanation
When you ask a standard AI a question about a complex research paper, it might sound convincing but invent facts (called "hallucinations"). This system solves that problem: it searches your uploaded PDF, finds the exact paragraphs related to your question, and quotes them as evidence before writing the explanation.

## How It Works
The entire workflow happens in four understandable steps:
1. **Document Reading**: The system extracts the text from your PDF and splits it into manageable chunks.
2. **Smart Indexing**: It turns those chunks into semantic embeddings stored in ChromaDB.
3. **Evidence Lookup**: When you submit a question, LangChain retrieves the top matching passages based on meaning, not just keywords.
4. **Grounded Answer**: The generative AI writes a structured answer referencing the exact pages retrieved.

## Step-by-Step Explanation
- **Step 1: Chunking with Overlap**: Sentences are grouped into 512 tokens with a 10% overlap so important ideas do not get cut in half.
- **Step 2: Vector Search**: Mathematical vectors measure how close your question is to the paper content.
- **Step 3: Prompt Building**: The AI is strictly instructed: *"Only use the provided paragraphs. If the document does not have enough evidence, state that clearly."*
- **Step 4: Answer Formatting**: The final output includes simple explanations, technical definitions, and citations.

## Important Points
- **Factual Accuracy**: Grounded retrieval reduces hallucination errors by 42% (Chen et al., Page 12).
- **Exact Lineage**: Every claim points back to a verified page number in your paper.
- **Study Friendly**: Focuses on the core concepts you need for coursework and exams.

## Limitations
- Scanned PDFs without readable text cannot be indexed without OCR.
- If the paper itself does not contain the answer, the system will explicitly state: *"Insufficient evidence in the selected sources."*

## Conclusion
This document-centric approach makes scientific literature easy to study and understand without the fear of misleading, fabricated AI responses.`,
    timestamp: '10:15 AM',
    grounded: true,
    explanationRole: 'Student',
    saved: true,
    sources: [
      {
        documentId: 'doc-1',
        documentName: 'Transformer_Architecture.pdf',
        page: 7,
        section: 'Section 3.2: Attention Mechanism Formulation',
        sourceType: 'document',
        similarityScore: 0.94,
        snippet: 'Section 3.2: In the proposed system, multi-head self-attention computes Scaled Dot-Product Attention Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V. The multi-stage pipeline integrates feed-forward networks with residual connections.'
      },
      {
        documentId: 'doc-3',
        documentName: 'NLP_Research_Survey.pdf',
        page: 12,
        section: 'Section 4.2: Retrieval Grounding and Hallucination Control',
        sourceType: 'document',
        similarityScore: 0.89,
        snippet: 'Table 4: Comparative evaluation demonstrates that retrieval-augmented methodologies consistently mitigate hallucination by 42% compared to pure parametric generation when grounding responses in dense vector repositories.'
      }
    ],
    recommendedVideos: [
      {
        id: 'rec-init-1',
        videoId: 'wjZofJX0v4U',
        title: 'Attention in transformers, visually explained | Chapter 6, Deep Learning',
        channel: '3Blue1Brown',
        duration: '26:45',
        thumbnailUrl: 'https://img.youtube.com/vi/wjZofJX0v4U/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=wjZofJX0v4U',
        relevanceExplanation: 'Provides intuitive visual geometry for query, key, and value vectors directly matching Section 3 of the paper.',
        targetAudience: 'Student',
        conceptTag: 'Self-Attention Mechanism'
      },
      {
        id: 'rec-init-2',
        videoId: 'T-D1OfcDW1M',
        title: 'Retrieval-Augmented Generation (RAG) Architecture Deep Dive',
        channel: 'IBM Technology',
        duration: '11:42',
        thumbnailUrl: 'https://img.youtube.com/vi/T-D1OfcDW1M/hqdefault.jpg',
        url: 'https://www.youtube.com/watch?v=T-D1OfcDW1M',
        relevanceExplanation: 'Concise architectural blueprint illustrating non-parametric vector database lookup and prompt augmentation.',
        targetAudience: 'Student',
        conceptTag: 'Retrieval-Augmented Generation'
      }
    ],
    metrics: {
      retrievalTimeMs: 142,
      tokensCount: 612,
      model: 'Generative AI (LangChain RAG)',
      depthMode: 'Detailed',
      explanationRole: 'Student'
    }
  }
];

export const sampleSummary: SummaryResult = {
  id: 'summ-1',
  documentId: 'doc-1',
  documentName: 'Transformer_Architecture.pdf',
  summaryType: 'Detailed Research Summary',
  length: 'Medium',
  language: 'English',
  audience: 'Intermediate',
  abstract: 'The paper introduces the Transformer, a sequence-to-sequence model architecture that dispenses entirely with recurrence and convolutions, relying exclusively on multi-head self-attention mechanisms.',
  problemStatement: 'Recurrent models (RNNs, LSTMs, GRUs) inherently compute states sequentially along the temporal dimension, preventing parallelization across training examples and struggling with long-range dependencies.',
  methodology: 'The authors propose an Encoder-Decoder framework built from stacked Self-Attention and Point-wise Feed-Forward networks, augmented with sinusoidal positional encodings and scaled dot-product attention heads.',
  dataset: 'WMT 2014 English-to-German (4.5M sentence pairs) and English-to-French (36M sentence pairs).',
  modelAlgorithm: 'Scaled Dot-Product Attention: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V with 8 parallel attention heads.',
  results: [
    'Achieved 28.4 BLEU on WMT 2014 English-to-German translation, improving by over 2.0 BLEU on previous state of the art.',
    'Training time was reduced to 3.5 days on 8 P100 GPUs, an order of magnitude faster than competing recurrent architectures.',
    'Self-attention layers exhibit constant O(1) sequential operations per layer, vastly improving gradient backpropagation across long token horizons.'
  ],
  advantages: [
    'Complete elimination of sequential recurrence enables full GPU tensor parallelization.',
    'Direct path length between distant tokens reduces semantic degradation in long sequences.',
    'Multi-head mechanism allows simultaneous attention to grammatical syntax and contextual semantics.'
  ],
  limitations: [
    'Quadratic O(n^2) computational and memory complexity with respect to sequence length n.',
    'Positional encoding heuristics do not naturally extrapolate to sequence lengths substantially longer than seen during training.',
    'Absence of inductive temporal bias requires larger training corpora to learn sequential ordering patterns.'
  ],
  futureScope: 'Extending attention mechanisms to large multimodal domains (vision, audio) and exploring linear attention approximations for ultra-long context horizons.',
  conclusion: 'The Transformer proves that attention mechanisms alone, without recurrent connections, achieve state-of-the-art translation quality while allowing unprecedented parallelization during training.',
  generatedAt: 'Today at 09:45 AM',
  saved: true
};

export const sampleVideoProject: LearningVideoProject = {
  id: 'vid-1',
  title: 'Retrieval-Augmented Generation Explained',
  topic: 'Explain Retrieval-Augmented Generation',
  sourceDocId: 'doc-4',
  sourceType: 'document',
  duration: '2 minutes',
  durationSeconds: 120,
  audience: 'Intermediate',
  language: 'English',
  style: 'Animated Educational',
  status: 'ready',
  backendConnected: true,
  createdAt: 'Today, 10:00 AM',
  scenes: [
    {
      sceneNumber: 1,
      title: 'Introduction — The Knowledge Dilemma',
      durationSeconds: 24,
      narrationScript: 'Welcome to this research briefing on Retrieval-Augmented Generation. Large language models possess vast parametric knowledge stored in their neural weights. Yet, their world is frozen in time at their training cutoff, making them susceptible to hallucinations when queried about specialized scientific literature.',
      onScreenText: 'Static Weights vs. Live Literature • The Knowledge Dilemma',
      visualDescription: 'Split screen displaying a static AI brain with outdated facts versus an active, expanding digital library of live research papers.',
      bulletPoints: ['Static LLM Weights', 'The Hallucination Bottleneck', 'The Need for Grounded Verifiability']
    },
    {
      sceneNumber: 2,
      title: 'The Core Problem — Parametric Limitations',
      durationSeconds: 24,
      narrationScript: 'When asked about cutting-edge research, a standard model may generate confident but fabricated citations. In high-stakes academic work and university research, accuracy and verifiability are non-negotiable requirements.',
      onScreenText: 'Hallucination Risk • Unverifiable Citations in Academic Work',
      visualDescription: 'Animated diagram of a user query encountering ambiguous weights and hallucinating nonexistent research citations.',
      bulletPoints: ['Unverifiable Citations', 'High-Stakes Academic Risk', 'Absence of Real-time Documents']
    },
    {
      sceneNumber: 3,
      title: 'How RAG Works — The Retrieval Loop',
      durationSeconds: 28,
      narrationScript: 'Retrieval-Augmented Generation bridges this gap. Instead of relying solely on memory, the system dynamically queries a vector database like ChromaDB, retrieves relevant document chunks based on cosine similarity, and grounds the generation process in cited evidence.',
      onScreenText: 'The RAG Pipeline • Chunking → ChromaDB Embeddings → Grounded Prompt',
      visualDescription: 'Animated pipeline illustrating document chunking, ChromaDB vector indexing, semantic search, and prompt augmentation.',
      bulletPoints: ['Semantic Vector Embeddings', 'ChromaDB Similarity Match', 'Prompt Context Augmentation']
    },
    {
      sceneNumber: 4,
      title: 'Practical Example — Multi-Paper Synthesis',
      durationSeconds: 24,
      narrationScript: 'Consider analyzing three distinct transformer papers. The RAG pipeline extracts exact passages with page numbers, ensuring every synthesis claim is backed by peer-reviewed evidence and traceable directly to source pages.',
      onScreenText: 'Traceable Research • Page 7 Vaswani et al. + Page 12 Chen et al.',
      visualDescription: 'Side-by-side view showing three research PDFs passing excerpts into an integrated comparative synthesis response with exact page citations.',
      bulletPoints: ['Cross-Document Synthesis', 'Page-Level Source Grounding', 'Zero-Guesswork Traceability']
    },
    {
      sceneNumber: 5,
      title: 'Key Takeaway — The Future of AI Research',
      durationSeconds: 20,
      narrationScript: 'By unifying semantic retrieval with generative AI through LangChain orchestration, researchers can turn complex documents into clear, trustworthy insights with verifiable academic citations. Thank you for watching.',
      onScreenText: 'Auditable • Scalable • Verifiable AI Research',
      visualDescription: 'Clean summary badge highlighting "Faithful • Scalable • Verifiable" with the university department seal watermark.',
      bulletPoints: ['Auditable Academic Insights', 'Drastic Hallucination Reduction', 'Continuous Knowledge Expansion']
    }
  ]
};

export const sampleCitations: CitationItem[] = [
  {
    id: 'cite-1',
    docId: 'doc-1',
    paperTitle: 'Attention Is All You Need',
    authors: ['A. Vaswani', 'N. Shazeer', 'N. Parmar', 'J. Uszkoreit', 'L. Jones', 'A. N. Gomez', 'Ł. Kaiser', 'I. Polosukhin'],
    year: 2017,
    venue: 'Advances in Neural Information Processing Systems (NeurIPS 2017)',
    doi: '10.48550/arXiv.1706.03762',
    volume: '30',
    pages: '5998–6008',
    url: 'https://arxiv.org/abs/1706.03762',
    publisher: 'Curran Associates, Inc.'
  },
  {
    id: 'cite-2',
    docId: 'doc-2',
    paperTitle: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: ['J. Devlin', 'M.-W. Chang', 'K. Lee', 'K. Toutanova'],
    year: 2019,
    venue: 'Proceedings of NAACL-HLT 2019',
    doi: '10.18653/v1/N19-1423',
    pages: '4171–4186',
    url: 'https://arxiv.org/abs/1810.04805',
    publisher: 'Association for Computational Linguistics'
  },
  {
    id: 'cite-3',
    docId: 'doc-4',
    paperTitle: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    authors: ['P. Lewis', 'E. Perez', 'A. Piktus', 'F. Petroni', 'V. Karpukhin', 'N. Goyal', 'H. Küttler', 'M. Lewis', 'W.-t. Yih', 'T. Rocktäschel', 'S. Riedel', 'D. Kiela'],
    year: 2020,
    venue: 'Advances in Neural Information Processing Systems (NeurIPS 2020)',
    doi: '10.48550/arXiv.2005.11401',
    volume: '33',
    pages: '9459–9474',
    url: 'https://arxiv.org/abs/2005.11401',
    publisher: 'Curran Associates, Inc.'
  }
];

export const sampleHistory: HistoryItem[] = [
  {
    id: 'hist-1',
    date: 'Today, 10:15 AM',
    type: 'question',
    title: 'What methodology is used in the proposed system?',
    sources: ['Transformer_Architecture.pdf', 'NLP_Research_Survey.pdf'],
    summaryText: 'Multi-stage RAG architecture combining dense ChromaDB embeddings with LangChain retrieval orchestration.',
    saved: true
  },
  {
    id: 'hist-2',
    date: 'Today, 09:45 AM',
    type: 'summary',
    title: 'Detailed Research Summary: Transformer_Architecture.pdf',
    sources: ['Transformer_Architecture.pdf'],
    summaryText: 'Executive and methodological summary focusing on multi-head attention and O(1) sequential path length.',
    saved: true
  },
  {
    id: 'hist-3',
    date: 'Today, 09:12 AM',
    type: 'video_script',
    title: 'Learning Video Script: Retrieval-Augmented Generation Explained',
    sources: ['RAG_Systematic_Review.pdf'],
    summaryText: '5-scene storyboarded script with visual instructions and 2-minute narration.',
    saved: false
  },
  {
    id: 'hist-4',
    date: 'Yesterday, 04:30 PM',
    type: 'comparison',
    title: 'Comparison: Transformer vs BERT vs RAG',
    sources: ['Transformer_Architecture.pdf', 'BERT_Language_Representation.pdf', 'RAG_Systematic_Review.pdf'],
    summaryText: '10-dimensional matrix contrasting recurrence vs masking vs non-parametric retrieval memory.',
    saved: false
  },
  {
    id: 'hist-5',
    date: 'Yesterday, 02:40 PM',
    type: 'youtube',
    title: 'YouTube Research: Attention in transformers, visually explained',
    sources: ['3Blue1Brown Video Lecture'],
    summaryText: 'Transcript extracted and analyzed; beginner library metaphor generated.',
    saved: true
  }
];

export const sampleSavedItems: SavedItem[] = [
  {
    id: 'save-1',
    type: 'answer',
    title: 'Grounded Methodology Answer',
    subtitle: 'RAG Architecture & ChromaDB HNSW Indexing',
    content: 'The proposed system employs a multi-stage Retrieval-Augmented Generation (RAG) framework coupled with dense vector representations and an autoregressive transformer decoder...',
    source: 'Transformer_Architecture.pdf (Page 7) & NLP_Research_Survey.pdf (Page 12)',
    savedAt: 'Today, 10:15 AM'
  },
  {
    id: 'save-2',
    type: 'summary',
    title: 'Detailed Research Summary',
    subtitle: 'Transformer_Architecture.pdf',
    content: 'Scaled Dot-Product Attention: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V with 8 parallel attention heads. Achieved 28.4 BLEU on WMT 2014 English-German.',
    source: 'Transformer_Architecture.pdf',
    savedAt: 'Today, 09:45 AM'
  },
  {
    id: 'save-3',
    type: 'passage',
    title: 'Key Evidence Passage',
    subtitle: 'Hallucination Mitigation Benchmark',
    content: 'Table 4: Comparative evaluation demonstrates that retrieval-augmented methodologies consistently mitigate hallucination by 42% compared to pure parametric generation when grounding responses in dense vector repositories.',
    source: 'NLP_Research_Survey.pdf (Page 12)',
    savedAt: 'Today, 09:30 AM'
  }
];
