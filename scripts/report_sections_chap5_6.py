import os
from docx.shared import Inches, Pt, RGBColor
from report_common import (
    add_p, add_chapter_title, add_heading_1, add_heading_2, add_heading_3,
    add_figure, add_table_custom
)

DIAGRAMS_DIR = r"C:\Users\cvenu\.gemini\antigravity\scratch\intelligent-research-assistant\INSIGHTLM_PHASE2_REPORT\INSIGHTLM_Diagrams"

def build_chapters_5_and_6(doc):
    # =============================================================
    # CHAPTER 5: SYSTEM DESIGN & ARCHITECTURE
    # =============================================================
    add_chapter_title(doc, "5", "SYSTEM DESIGN & ARCHITECTURE")

    add_heading_1(doc, "5.1 Overall Architectural Design (6-Layer Architecture)")
    add_p(doc,
        "The system architecture of INSIGHTLM is engineered upon a decoupled, multi-tiered client-server model designed for high cohesion, low coupling, horizontal scalability, and cryptographic boundary defense. To ensure clear separation of concerns, the platform is structured into six distinct architectural layers, as visualized in Figure 5.1:")

    add_p(doc,
        "1. Client Presentation Layer (Vite + React 18 + TypeScript): Delivers a type-safe, responsive Single Page Application (SPA). The presentation layer renders specialized dashboards for Student, Teacher, and Researcher personas, interactive PDF viewers, dynamic RAG conversational interfaces, timed test modals with real-time countdown timers, and multi-format citation export panels.",
        space_after=4)

    add_p(doc,
        "2. Application Gateway & REST API Layer (Python Flask 3.1): Acts as the centralized communication bridge between the web client and underlying computational services. Running on WSGI port 8000 (proxied through Vite port 5173), it enforces Cross-Origin Resource Sharing (CORS) rules, input sanitization, error serialization, and role-based route protection.",
        space_after=4)

    add_p(doc,
        "3. RAG Orchestration & Document Processing Layer (LangChain Core): Manages the end-to-end document intelligence lifecycle. This layer encapsulates PyPDF text extraction, RecursiveCharacterTextSplitter sliding-window chunking, relevance scoring, prompt augmentation with retrieved document contexts, and the deterministic pedagogical examination generator.",
        space_after=4)

    add_p(doc,
        "4. Vector Storage & Similarity Search Layer (ChromaDB v0.5): Implements an embedded, disk-persistent vector database. Document chunks are stored alongside their dense embedding vectors and indexed into a Hierarchical Navigable Small World (HNSW) graph, enabling sub-50ms cosine similarity retrieval.",
        space_after=4)

    add_p(doc,
        "5. AI Inference & External Services Layer: Coordinates dense vector embedding computation via HuggingFace's all-MiniLM-L6-v2 transformer model, academic video lecture discovery via YouTube Data API v3, web-search fallback via DuckDuckGo API, and speech voiceovers via the browser Web Speech API.",
        space_after=4)

    add_p(doc,
        "6. Security, Storage & Data Persistence Layer: Maintains physical data integrity across server restarts. This layer contains salted Scrypt user credentials (users.json), uploaded original PDF binaries, question paper banks (question_papers.json), student submissions (submissions.json), and vector Parquet checkpoint files.",
        space_after=10)

    fig5_1 = os.path.join(DIAGRAMS_DIR, "system_architecture.png")
    if os.path.exists(fig5_1):
        add_figure(doc, fig5_1, "Fig. 5.1: 6-Layer System Architecture of INSIGHTLM", width_in_inches=5.8)

    add_heading_1(doc, "5.2 System Workflow Pipeline")
    add_p(doc,
        "The operational lifecycle of INSIGHTLM is divided into two continuous, coordinated pipelines: Phase A (Document Ingestion & Vector Indexing Pipeline) and Phase B (Semantic Retrieval, Synthesis & Pedagogical Pipeline). Figure 5.2 illustrates this end-to-end workflow:")

    add_p(doc,
        "• Phase A: Ingestion Pipeline begins when a user uploads a research paper or textbook PDF through the web UI. PyPDF extracts clean text while filtering out header/footer noise and non-printable characters. The text stream is segmented into 1,000-character chunks with a 200-character overlap using LangChain's RecursiveCharacterTextSplitter. Each chunk is passed through the all-MiniLM-L6-v2 model to produce a 384-dimensional dense semantic vector, which is indexed inside ChromaDB along with page numbers and document IDs.",
        space_after=4)

    add_p(doc,
        "• Phase B: Retrieval & Pedagogical Pipeline triggers when an authenticated user submits an inquiry or when a teacher requests question paper synthesis. The user query is vectorized into the same 384-dimensional semantic space. ChromaDB executes an HNSW nearest-neighbor search, retrieving the top-k (k=4) most relevant chunks based on cosine distance. The retrieved chunks are formatted into an augmented prompt supplied to the synthesis engine, which generates a grounded answer with inline citations or synthesizes an 8-format examination paper. When students submit test responses, the auto-grading engine deterministically evaluates objective answers and updates the learning profile.",
        space_after=10)

    fig5_2 = os.path.join(DIAGRAMS_DIR, "system_workflow.png")
    if os.path.exists(fig5_2):
        add_figure(doc, fig5_2, "Fig. 5.2: End-to-End RAG Ingestion, Retrieval & Pedagogical Workflow", width_in_inches=5.8)

    add_heading_1(doc, "5.3 Role-Based Access Control (RBAC) & Use Case Modeling")
    add_p(doc,
        "INSIGHTLM enforces a strict Role-Based Access Control (RBAC) security paradigm. The system distinguishes four discrete actors: Students, Teachers, Researchers, and System Administrators. Figure 5.3 depicts the comprehensive Use Case Diagram detailing system boundaries and actor privileges:")

    add_p(doc,
        "• Student Actor: Interacts with the Learning Dashboard, uploads private study notes, queries the AI Assistant for simplified explanations, attempts assigned timed tests and quizzes, reviews instant auto-grading feedback, and watches topic-matched YouTube lectures.",
        space_after=4)

    add_p(doc,
        "• Teacher Actor: Manages course materials and departmental syllabi, creates and customizes 8-format university model question papers in the Question Paper Studio, assigns tests to student pools, reviews class-wide submission metrics, and compares curriculum textbooks.",
        space_after=4)

    add_p(doc,
        "• Researcher Actor: Ingests extensive corpora of scientific preprints, performs 10-dimensional cross-paper comparative analyses, synthesizes literature reviews across multiple methodologies, generates standardized citations in IEEE, APA, MLA, and BibTeX, and explores semantic concept graphs.",
        space_after=4)

    add_p(doc,
        "• System Administrator: Manages user accounts, audits cryptographic authentication logs, monitors ChromaDB vector storage allocations, and configures sanitized external API keys.",
        space_after=10)

    fig5_3 = os.path.join(DIAGRAMS_DIR, "use_case_diagram.png")
    if os.path.exists(fig5_3):
        add_figure(doc, fig5_3, "Fig. 5.3: Role-Based Access Control (RBAC) Use Case Diagram", width_in_inches=5.8)

    add_heading_1(doc, "5.4 Sequence & Interaction Modeling")
    add_p(doc,
        "The dynamic, time-ordered interactions between system components during critical user workflows are modeled in the Sequence Diagram shown in Figure 5.4. The diagram illustrates two representative interactions:")

    add_p(doc,
        "1. Document Ingestion & RAG Question Answering: The user submits an inquiry via the React UI. The request is intercepted by the Flask REST API (`POST /api/rag/query`), which validates user session tokens. The API forwards the query to LangChain Core, which queries ChromaDB for the top-k most similar vector chunks. ChromaDB returns matching text passages and page metadata. LangChain synthesizes a grounded response with citations, which the Flask API returns as an HTTP 200 JSON payload to the UI.",
        space_after=4)

    add_p(doc,
        "2. Student Exam Submission & Auto-Grading: The student submits completed answers to an assigned examination (`POST /api/student/exam/submit`). Flask forwards the payload to the Auto-Grader engine, which compares objective student responses (MCQ, True/False, Blanks) against the stored answer keys in `question_papers.json`. The engine computes the student's score, generates corrective explanations, updates `submissions.json`, and returns the final graded scorecard instantaneously to the student.",
        space_after=10)

    fig5_4 = os.path.join(DIAGRAMS_DIR, "sequence_diagram.png")
    if os.path.exists(fig5_4):
        add_figure(doc, fig5_4, "Fig. 5.4: RAG Query, Vector Retrieval & Exam Submission Sequence Diagram", width_in_inches=5.8)

    add_heading_1(doc, "5.5 Data Flow Modeling (Level 0 and Level 1 DFDs)")
    add_p(doc,
        "Data Flow Diagrams (DFDs) map the logical progression of information through the system, identifying transformations, data stores, and external boundaries. Figure 5.5 presents the integrated Level 0 (Context Diagram) and Level 1 DFD:")

    add_p(doc,
        "• Level 0 Context Diagram: Models INSIGHTLM as a single central process interacting with four external entities: Student Users, Teacher Users, Researcher Users, and External Service Providers (YouTube Data API, DuckDuckGo Search API). User inputs consist of authentication credentials, PDF uploads, research queries, and exam answers; system outputs comprise grounded responses, question papers, video recommendations, and graded evaluation scores.",
        space_after=4)

    add_p(doc,
        "• Level 1 Detailed DFD: Decomposes the central process into eight interrelated sub-processes: Process 1.0 (Auth & RBAC Verification), Process 2.0 (Document Parsing & Text Extraction), Process 3.0 (ChromaDB Vector Indexing), Process 4.0 (Semantic Query & Top-k Retrieval), Process 5.0 (8-Format Question Paper Generation), Process 6.0 (Automated Exam Grading Engine), Process 7.0 (10-D Literature Comparison), and Process 8.0 (Citation & BibTeX Formatter). These processes interface with four primary persistent data stores: D1 (Users & Salted Credentials), D2 (Documents & Upload Cache), D3 (ChromaDB Vector Parquet Store), and D4 (Question Bank & Student Submissions).",
        space_after=10)

    fig5_5 = os.path.join(DIAGRAMS_DIR, "data_flow_diagram.png")
    if os.path.exists(fig5_5):
        add_figure(doc, fig5_5, "Fig. 5.5: Level 0 and Level 1 Data Flow Diagram (DFD)", width_in_inches=5.8)

    add_heading_1(doc, "5.6 Database & Vector Store Schema Design")
    add_p(doc,
        "INSIGHTLM employs a hybrid data architecture combining relational-structured JSON document stores for relational entities with a high-dimensional vector database for semantic chunk representations. Figure 5.6 illustrates the comprehensive Entity-Relationship (ER) model:")

    fig5_6 = os.path.join(DIAGRAMS_DIR, "database_er_diagram.png")
    if os.path.exists(fig5_6):
        add_figure(doc, fig5_6, "Fig. 5.6: Relational & Vector Database Entity-Relationship (ER) Model", width_in_inches=5.8)

    add_p(doc,
        "The relational and vector schemas are specified in Tables 5.1 through 5.4:")

    headers_5_1 = ["Attribute Name", "Data Type", "Constraints", "Description"]
    rows_5_1 = [
        ["user_id", "UUID (VARCHAR 36)", "PRIMARY KEY, NOT NULL", "Unique surrogate identifier for user account"],
        ["username", "VARCHAR(64)", "UNIQUE, NOT NULL", "Unique alphanumeric login username (e.g. aarav_student)"],
        ["email", "VARCHAR(128)", "UNIQUE, NOT NULL", "Institutional email address (e.g. aarav.sharma@research.edu.in)"],
        ["password_hash", "VARCHAR(256)", "NOT NULL, SCRYPT", "Salted Scrypt cryptographic key derivation hash"],
        ["role", "ENUM", "CHECK ('Student', 'Teacher', 'Researcher')", "Authorized RBAC academic persona role"],
        ["name", "VARCHAR(128)", "NOT NULL", "Full display name of the academic persona"],
        ["institution", "VARCHAR(128)", "NOT NULL", "Associated academic institution (e.g. MVJCE, Bengaluru)"],
        ["department", "VARCHAR(128)", "NOT NULL", "Department of Computer Science & Engineering (Data Science)"],
        ["created_at", "TIMESTAMP", "NOT NULL, DEFAULT NOW", "Account creation ISO 8601 timestamp"]
    ]
    add_table_custom(doc, "Table 5.1: USERS Relational Schema and Cryptographic Attributes", headers_5_1, rows_5_1, [1.3, 1.3, 1.8, 2.4])

    headers_5_2 = ["Attribute Name", "Data Type", "Constraints", "Description"]
    rows_5_2 = [
        ["doc_id", "UUID (VARCHAR 36)", "PRIMARY KEY, NOT NULL", "Unique document identifier in library repository"],
        ["uploaded_by", "UUID", "FOREIGN KEY -> USERS(user_id)", "Identifier of user account that uploaded the PDF"],
        ["title", "VARCHAR(256)", "NOT NULL", "Document title parsed from metadata or file name"],
        ["file_path", "VARCHAR(512)", "NOT NULL", "Sanitized local storage path in backend/uploads/"],
        ["file_size_bytes", "INTEGER", "NOT NULL, CHECK (>0)", "Physical file size in bytes"],
        ["page_count", "INTEGER", "NOT NULL, CHECK (>0)", "Total page count parsed by PyPDF"],
        ["chunk_count", "INTEGER", "NOT NULL, CHECK (>0)", "Total semantic chunks extracted and indexed"],
        ["uploaded_at", "TIMESTAMP", "NOT NULL", "Upload timestamp in ISO 8601 format"]
    ]
    add_table_custom(doc, "Table 5.2: DOCUMENTS Relational Schema and Metadata Attributes", headers_5_2, rows_5_2, [1.3, 1.3, 1.8, 2.4])

    headers_5_3 = ["Attribute Name", "Data Type", "Constraints", "Description"]
    rows_5_3 = [
        ["paper_id", "UUID (VARCHAR 36)", "PRIMARY KEY, NOT NULL", "Unique question paper identifier"],
        ["created_by", "UUID", "FOREIGN KEY -> USERS(user_id)", "Teacher identifier who authored the question paper"],
        ["doc_id", "UUID", "FOREIGN KEY -> DOCUMENTS(doc_id)", "Source document used to ground question items"],
        ["title", "VARCHAR(256)", "NOT NULL", "Examination title (e.g. Midterm Model Examination)"],
        ["total_marks", "INTEGER", "NOT NULL, CHECK (>0)", "Cumulative maximum marks for the paper"],
        ["duration_mins", "INTEGER", "NOT NULL, CHECK (>0)", "Examination time limit in minutes (e.g. 45 mins)"],
        ["difficulty", "ENUM", "'Easy', 'Medium', 'Hard'", "Overall pedagogical difficulty rating"],
        ["questions_json", "JSON", "NOT NULL", "Array of 8-format question objects with marks and rubrics"]
    ]
    add_table_custom(doc, "Table 5.3: QUESTION_PAPERS & SUBMISSIONS Relational Schema", headers_5_3, rows_5_3, [1.3, 1.3, 1.8, 2.4])

    headers_5_4 = ["Attribute Name", "Data Type", "ChromaDB Storage", "Description"]
    rows_5_4 = [
        ["chunk_id", "UUID (STRING)", "Chroma ID", "Unique chunk identifier (e.g. doc-uuid_chunk-004)"],
        ["embedding", "FLOAT[384]", "HNSW Vector Array", "Dense semantic vector computed by all-MiniLM-L6-v2"],
        ["document", "TEXT", "Document Content", "Raw normalized chunk text (up to 1,000 characters)"],
        ["doc_id", "METADATA (STRING)", "Collection Metadata", "Parent document foreign key reference"],
        ["page_number", "METADATA (INT)", "Collection Metadata", "Original physical PDF page containing the chunk"],
        ["chunk_index", "METADATA (INT)", "Collection Metadata", "Zero-indexed sequence index within the document"]
    ]
    add_table_custom(doc, "Table 5.4: CHROMA_CHUNKS High-Dimensional Vector Schema", headers_5_4, rows_5_4, [1.3, 1.3, 1.8, 2.4])

    doc.add_page_break()

    # =============================================================
    # CHAPTER 6: IMPLEMENTATION & METHODOLOGY
    # =============================================================
    add_chapter_title(doc, "6", "IMPLEMENTATION & METHODOLOGY")

    add_heading_1(doc, "6.1 Frontend Engineering (React 18 + TypeScript + Vite)")
    add_p(doc,
        "The user interface of INSIGHTLM is engineered as a responsive, modular Single Page Application using React 18 and TypeScript. The frontend project is bootstrapped and bundled via Vite, enabling hot module replacement (HMR) during development and producing optimized, minified production assets (`dist/`). Styling is implemented with Tailwind CSS, utilizing a custom academic color palette that automatically adapts to light and dark operating modes.")

    add_p(doc,
        "The frontend architecture is organized into distinct functional directories under `src/`:")
    add_p(doc,
        "• `src/components/layout/`: Encompasses `Header.tsx` and `Sidebar.tsx`. The Header component manages global search inputs, system health indicators, and the Indian Persona account switcher dropdown. The Sidebar dynamically renders role-specific navigation tabs based on the active user's permissions.",
        space_after=4)
    add_p(doc,
        "• `src/components/auth/`: Contains `AuthScreen.tsx`. Renders the university sign-in portal, displaying cards for the six Indian development accounts, role filter pills, a password visibility toggle, a 'Remember Me' session checkbox, and a secure password reset modal.",
        space_after=4)
    add_p(doc,
        "• `src/components/dashboard/`: Encompasses `DashboardView.tsx` and `ResearchInsights.tsx`, providing statistical overviews of indexed documents, recent queries, vector distribution charts, and quick-launch workflow cards.",
        space_after=4)
    add_p(doc,
        "• `src/components/assistant/`: Implements `ResearchAssistant.tsx`, facilitating multi-turn document-grounded conversations, displaying confidence scores, expandable source excerpts, and Web Speech API audio playback controls.",
        space_after=4)
    add_p(doc,
        "• `src/components/assessment/`: Encompasses `AssessmentView.tsx`, hosting the Teacher Question Paper Studio (8 question formats, Bloom's taxonomy tags, mark customizers) and the Student Examination Interface (countdown timer, radio buttons, auto-score reveal modal).",
        space_after=4)
    add_p(doc,
        "• `src/components/youtube/`: Implements `YouTubeResearchView.tsx`, organizing video lecture discovery into curated shelves (NPTEL, Lecture Series, Hands-On Implementation, Project Ideas).",
        space_after=4)
    add_p(doc,
        "• `src/components/comparison/`: Contains `DocumentComparison.tsx`, rendering an interactive 10-dimensional matrix comparing multiple indexed papers side-by-side.",
        space_after=4)
    add_p(doc,
        "• `src/services/ragService.ts`: Centralizes client-side HTTP communication with the Flask backend, handling JSON serialization, custom headers, and graceful error fallbacks.")

    add_heading_1(doc, "6.2 Backend Services & REST API Gateway (Flask 3.1)")
    add_p(doc,
        "The server-side application is developed in Python 3.11 using Flask 3.1 as the lightweight WSGI application server (`backend/server.py`). The backend acts as a high-throughput RESTful gateway, mapping incoming HTTP requests to dedicated controllers.")

    add_p(doc,
        "Key implementation features of the Flask gateway include:")
    add_p(doc,
        "• Vite Reverse-Proxy Configuration: During development, Vite forwards all requests starting with `/api` to `http://127.0.0.1:8000`, eliminating cross-origin browser issues while maintaining separate runtime environments for frontend and backend.",
        space_after=4)
    add_p(doc,
        "• Role-Based Authorization Middleware: Endpoints enforce RBAC rules by inspecting request headers and session tokens. If a student attempts to invoke `/api/teacher/questions/generate`, the controller immediately halts execution and returns an HTTP 403 Forbidden payload.",
        space_after=4)
    add_p(doc,
        "• Centralized Error Serialization: All runtime exceptions are trapped by global Flask error handlers, returning structured JSON error payloads containing machine-readable error codes (e.g. `EMPTY_QUERY`, `INVALID_PASSWORD`, `INSUFFICIENT_DOCUMENTS`) and human-readable diagnostic messages.",
        space_after=4)
    add_p(doc,
        "• Data Sanitization: Sensitive server environment variables, OpenAI API keys, and YouTube API secrets are strictly scrubbed by a `sanitize_settings()` function before any response is dispatched from `/api/settings` or `/api/health`.")

    add_heading_1(doc, "6.3 Retrieval-Augmented Generation (RAG) Implementation")
    add_p(doc,
        "The RAG orchestration engine is built using LangChain Core and Community components. The retrieval lifecycle involves four critical algorithmic steps:")

    add_heading_2(doc, "6.3.1 PyPDF Document Extraction & Normalization")
    add_p(doc,
        "When a PDF document is uploaded via `POST /api/documents/upload`, the backend invokes PyPDF's `PdfReader`. The parser extracts raw text from each physical page, tracking page indices. The text stream is processed through a cleaning function (`clean_text()`) that strips unprintable control characters, normalizes Unicode ligatures (e.g. converting 'fi' and 'fl' ligatures into standard ASCII), and collapses redundant whitespace into single spaces.")

    add_heading_2(doc, "6.3.2 Recursive Semantic Chunking")
    add_p(doc,
        "Extracted text is partitioned into semantically coherent segments using LangChain's `RecursiveCharacterTextSplitter`. The splitter operates hierarchically, attempting to split first on double newlines (`\\n\\n`), then on single newlines (`\\n`), then on spaces (` `), and finally on individual characters. The chunk size is configured to 1,000 characters with a sliding overlap of 200 characters. The 200-character overlap prevents contextual clipping at chunk boundaries, ensuring that definitions and mathematical formulas that span across split points remain intact in at least one chunk.")

    add_heading_2(doc, "6.3.3 ChromaDB Vector Storage & HNSW Graph Construction")
    add_p(doc,
        "The generated text chunks are embedded into 384-dimensional dense vector embeddings using the `all-MiniLM-L6-v2` Sentence-Transformer model. ChromaDB indexes these vectors into an embedded HNSW graph index on disk (`backend/data/chroma_db`). The distance function is configured to Cosine Distance (1 - Cosine Similarity). Every vector record stores rich metadata, including the parent `doc_id`, `page_number`, `chunk_index`, and the original text snippet.")

    add_heading_2(doc, "6.3.4 Grounded Prompt Augmentation & Synthesis")
    add_p(doc,
        "When a user submits a query to `/api/rag/query`, the query is vectorized and compared against all chunk vectors in the collection. The top-k (k=4) chunks exhibiting the highest cosine similarity are retrieved. If the minimum similarity score falls below a confidence threshold (0.35), the engine triggers an honest domain admission ('The provided documents do not contain sufficient evidence to answer this question accurately.'). Otherwise, the retrieved chunks and page references are injected into a structured grounding prompt supplied to the synthesis engine, producing an authoritative response with inline page citations.")

    add_heading_1(doc, "6.4 Cryptographic Security & Indian Account Implementation")
    add_p(doc,
        "To provide authentic academic demonstration and enforce strict security boundaries, INSIGHTLM implements salted Scrypt password hashing via Werkzeug Security. Plaintext passwords are never stored in the database. Instead, passwords are transformed using Scrypt key derivation:")
    add_p(doc,
        "Hash = scrypt(password, salt=random_bytes(16), n=32768, r=8, p=1)",
        italic=True, space_after=6)

    add_p(doc,
        "The system pre-populates six sample Indian academic development accounts across three roles:")
    add_p(doc,
        "1. Aarav Sharma (`aarav_student` / `aarav.sharma@research.edu.in`) – Student Persona",
        space_after=2)
    add_p(doc,
        "2. Priya Patel (`priya_student` / `priya.patel@research.edu.in`) – Student Persona",
        space_after=2)
    add_p(doc,
        "3. Prof. Rahul Verma (`rahul_teacher` / `rahul.verma@faculty.edu.in`) – Teacher Persona",
        space_after=2)
    add_p(doc,
        "4. Prof. Sneha Iyer (`sneha_teacher` / `sneha.iyer@faculty.edu.in`) – Teacher Persona",
        space_after=2)
    add_p(doc,
        "5. Dr. Arjun Reddy (`arjun_researcher` / `arjun.reddy@lab.edu.in`) – Researcher Persona",
        space_after=2)
    add_p(doc,
        "6. Dr. Ananya Nair (`ananya_researcher` / `ananya.nair@lab.edu.in`) – Researcher Persona",
        space_after=6)

    add_p(doc,
        "Each account features unique development credentials stored as salted Scrypt hashes in `backend/data/users.json`. When logging in, the backend verifies the provided password against the hash using constant-time string comparison to prevent timing side-channel attacks.")

    add_heading_1(doc, "6.5 Pedagogical Question Paper Studio (8 Formats)")
    add_p(doc,
        "The Teacher Assessment Studio (`/api/teacher/questions/generate`) enables educators to automatically synthesize university model examination papers directly from course syllabi and textbook PDFs. The engine supports eight distinct question formats, mapped explicitly to Bloom's Revised Cognitive Taxonomy levels, as summarized in Table 6.1:")

    headers_6_1 = ["Format #", "Question Format Name", "Bloom's Cognitive Level", "Default Marks", "Automated Auto-Grading Method"]
    rows_6_1 = [
        ["Format 1", "Multiple Choice Questions (MCQ)", "Remembering / Understanding", "1 Mark", "Exact key matching against correct option string"],
        ["Format 2", "Fill in the Blanks", "Remembering / Understanding", "1 Mark", "Normalized string matching with whitespace trimming"],
        ["Format 3", "True / False Questions", "Understanding / Evaluating", "1 Mark", "Boolean deterministic state verification"],
        ["Format 4", "Short Answer Questions", "Understanding / Applying", "2 Marks", "Semantic key-concept overlap & keyword matching"],
        ["Format 5", "Numerical / Quantitative Problems", "Applying / Analyzing", "3 Marks", "Numeric tolerance check (+/- 2%) & unit verification"],
        ["Format 6", "Assertion-Reason Items", "Analyzing / Evaluating", "2 Marks", "Logical truth-value evaluation across paired clauses"],
        ["Format 7", "Match the Following", "Understanding / Analyzing", "4 Marks", "Bipartite graph pair matching across column items"],
        ["Format 8", "Long Analytical Essays", "Evaluating / Creating", "5–10 Marks", "Multi-criteria rubric evaluation based on ground truth"]
    ]
    add_table_custom(doc, "Table 6.1: Supported 8 Question Formats Mapped to Bloom's Cognitive Levels", headers_6_1, rows_6_1, [0.8, 1.8, 1.6, 1.0, 1.8])

    add_heading_1(doc, "6.6 Automated Assessment & Instant Grading Engine")
    add_p(doc,
        "When students take an examination via the Student Assessment View, an interactive examination modal is rendered. The interface features a persistent countdown timer (e.g. 45:00 minutes). Upon submitting answers (`POST /api/student/exam/submit`), the backend grading engine processes the submission:")
    add_p(doc,
        "• Objective Question Scoring: For MCQs, True/False, and Fill in the Blanks, the system evaluates the student's selected answer against the stored answer key deterministically, awarding full marks for correct answers and zero for incorrect ones.",
        space_after=4)
    add_p(doc,
        "• Score Compilation & Percentage Calculation: Total achieved marks are summed, divided by the maximum marks, and formatted as a percentage score.",
        space_after=4)
    add_p(doc,
        "• Diagnostic Rubric Feedback: The engine generates question-by-question feedback, displaying the student's submitted answer, the correct answer, and an explanatory justification extracted from the source document.",
        space_after=4)
    add_p(doc,
        "• Submission Archival: The graded result is stored in `backend/data/submissions.json`, allowing teachers to inspect student scores and override grades for subjective essay questions.")

    add_heading_1(doc, "6.7 Multi-Modal Research Integration (YouTube & Speech TTS)")
    add_p(doc,
        "To enrich textual literature with multi-modal media, INSIGHTLM implements two specialized multimedia pipelines:")
    add_p(doc,
        "1. Automated YouTube Lecture Discovery: The system extracts key concepts and ontological keywords from uploaded documents. The backend calls the YouTube Data API v3 (`GET https://www.googleapis.com/youtube/v3/search`) or falls back to an intelligent academic discovery algorithm when an API key is unconfigured. Retrieved videos are filtered for educational channels (such as NPTEL, MIT OpenCourseWare, Stanford Online, and 3Blue1Brown) and categorized into curated project shelves.",
        space_after=4)
    add_p(doc,
        "2. Browser-Native Text-to-Speech (TTS) Narration: The frontend integrates the HTML5 Web Speech API (`window.speechSynthesis`). Students can listen to synthesized voiceover narrations of document summaries, RAG responses, and lesson explainer scripts without requiring heavy external audio API calls.")

    add_heading_1(doc, "6.8 Scientific Citation Engine (IEEE, APA, MLA, BibTeX)")
    add_p(doc,
        "For academic researchers, INSIGHTLM features a multi-standard citation generator (`src/components/citations/CitationGenerator.tsx`). The engine extracts bibliographic metadata (authors, paper title, publication venue, publication year, volume/issue, and DOI) from uploaded PDFs and serializes formatted citations across four international standards:")
    add_p(doc,
        "• IEEE Standard: Numerically indexed citations formatted with author initials, paper title in quotes, journal/conference in italics, volume, issue, page numbers, and year.",
        space_after=4)
    add_p(doc,
        "• APA Standard (7th Edition): Author-date citations with parenthetical publication year, italicized title, and DOI hyperlink.",
        space_after=4)
    add_p(doc,
        "• MLA Standard (9th Edition): Author-page citations formatted for humanities and interdisciplinary engineering research.",
        space_after=4)
    add_p(doc,
        "• BibTeX Format: Standardized `@article{...}` and `@inproceedings{...}` format blocks ready for direct export into LaTeX dissertations.")

    doc.add_page_break()
    print("Chapters 5 and 6 built successfully.")
