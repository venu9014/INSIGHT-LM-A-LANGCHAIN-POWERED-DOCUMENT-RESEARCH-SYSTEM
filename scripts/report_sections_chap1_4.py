import os
from docx.shared import Inches, Pt, RGBColor
from report_common import (
    add_p, add_chapter_title, add_heading_1, add_heading_2, add_heading_3,
    add_table_custom
)

def build_chapters_1_to_4(doc):
    # =============================================================
    # CHAPTER 1: INTRODUCTION
    # =============================================================
    add_chapter_title(doc, "1", "INTRODUCTION")

    add_heading_1(doc, "1.1 Background and Context")
    add_p(doc,
        "In modern higher education, scientific research, and professional engineering, digital literature has grown at an unprecedented rate. Millions of peer-reviewed journal papers, academic textbooks, institutional dissertations, and technical specifications are published each year. While this wealth of information presents profound opportunities for technological discovery, it has concurrently generated an acute information overload. Engineering students, academic faculty, and scientific researchers spend an inordinate proportion of their working hours manually scanning dense, multi-page Portable Document Format (PDF) files to locate specific formulas, methodologies, algorithmic proofs, and empirical findings. Traditional keyword-based retrieval utilities (such as standard desktop PDF search or relational database string lookups) rely strictly on exact lexical matching, rendering them utterly blind to semantic equivalence, conceptual synonyms, and contextual nuances.")

    add_p(doc,
        "The recent emergence of foundational Large Language Models (LLMs), powered by multi-billion parameter transformer architectures, has fundamentally redefined human interaction with textual knowledge. Models such as GPT-4, Gemini, and LLaMA demonstrate extraordinary capabilities in natural language reasoning, abstractive summarization, code generation, and multi-turn conversational dialogue. However, despite their impressive linguistic fluency, foundational LLMs suffer from four debilitating structural deficiencies when applied directly to serious academic and technical research without architectural augmentation:")

    add_p(doc,
        "1. Hallucinatory Vulnerabilities: Foundational generative models operate probabilistically, predicting next tokens based on statistical associations rather than verifiable factual grounding. When queried regarding esoteric mathematical equations, niche scientific papers, or specific departmental syllabi, standalone LLMs frequently fabricate plausible-sounding yet completely erroneous citations, figures, and conclusions.",
        space_after=4)

    add_p(doc,
        "2. Absence of Direct Citation Attribution: Traditional autoregressive language models do not intrinsically furnish verifiable page-level or chunk-level attribution. In rigorous collegiate academic environments, an ungrounded assertion is scientifically unacceptable; every claim, numerical benchmark, and definition must be traceable to a specific paragraph, table, or page within an authoritative primary source.",
        space_after=4)

    add_p(doc,
        "3. Knowledge Latency and Cutoff Boundaries: Foundational models are bounded by their static pre-training datasets. They possess zero native awareness of proprietary institutional documents, recently uploaded research preprints, or private course textbooks published after their training cutoff date.",
        space_after=4)

    add_p(doc,
        "4. Context Window Saturation and Economic Costs: While recent models support extended context windows (e.g., 32k or 128k tokens), stuffing an entire 500-page engineering textbook or dozens of research papers into a single context prompt incurs prohibitive inference latency, quadratic computational attention costs, and the well-documented 'lost-in-the-middle' phenomenon where LLMs fail to retrieve critical details embedded in lengthy contexts.")

    add_p(doc,
        "To systematically address these bottlenecks, the paradigm of Retrieval-Augmented Generation (RAG) has emerged as the definitive state-of-the-art framework. In a RAG architecture, an external, non-parametric knowledge corpus is segmented, vectorized into a high-dimensional continuous semantic space, and indexed inside an optimized vector database. When a user submits an inquiry, the system first retrieves the top-k most semantically relevant text passages via dense vector similarity matching and subsequently injects these retrieved passages as factual grounding context into the prompt passed to the generative language model.")

    add_heading_1(doc, "1.2 Motivation")
    add_p(doc,
        "The motivation driving the development of INSIGHTLM: A LangChain-Powered Document Research System stems directly from observed pedagogical and research inefficiencies within academic institutions such as MVJ College of Engineering. Specifically:")

    add_p(doc,
        "• Student Learning Inefficiencies: Undergraduate engineering students frequently struggle to extract core conceptual intuitions from dense scientific literature. When preparing for university examinations, they lack unified tools to quickly synthesize textbook definitions, obtain instant clarification on complex diagrams, and test their comprehension against model examination questions.",
        space_after=4)

    add_p(doc,
        "• Faculty Assessment Overhead: Academic professors and course coordinators invest substantial time manually drafting balanced examination papers across different cognitive levels (Bloom's Taxonomy). Generating diverse question formats—ranging from Multiple Choice Questions (MCQs) to numerical problems, assertion-reason items, and long analytical essays—demands extensive manual effort.",
        space_after=4)

    add_p(doc,
        "• Researcher Literature Review Bottlenecks: Research scholars embarking on literature surveys must manually read across multiple competing papers to construct comparative methodology matrices, identify unaddressed research gaps, and format citations according to IEEE, APA, or BibTeX conventions.",
        space_after=4)

    add_p(doc,
        "• Lack of Multi-Modal Integration: While students increasingly rely on video lectures (e.g., NPTEL, MIT OpenCourseWare, YouTube) to supplement textbook reading, existing document systems operate in total isolation from external video repositories, failing to connect textual topics with relevant visual lectures.")

    add_p(doc,
        "INSIGHTLM was conceived to synthesize these disparate requirements into a single, cohesive, production-grade platform that unifies document ingestion, dense vector retrieval, role-based pedagogical intelligence, automated examination synthesis, and multi-modal lecture discovery.")

    add_heading_1(doc, "1.3 Project Overview & Scope")
    add_p(doc,
        "INSIGHTLM is an end-to-end, full-stack, enterprise-grade AI research and learning platform engineered specifically for academic ecosystems. Developing upon the foundational concepts explored during Phase 1, the Phase 2 implementation transforms the preliminary concept into a fully realized, decoupled, and production-tested software platform.")

    add_p(doc,
        "The scope of INSIGHTLM encompasses the following primary functional domains:")
    add_p(doc,
        "1. Document Ingestion and Vector Indexing: Automated parsing of multi-page PDF documents, semantic sliding-window chunking (1,000 characters with 200-character overlap), 384-dimensional dense semantic embedding generation using all-MiniLM-L6-v2, and persistent HNSW graph indexing inside ChromaDB v0.5.",
        space_after=4)
    add_p(doc,
        "2. Grounded Multi-Turn Question Answering: Interactive conversational assistant providing factual responses strictly grounded in indexed document chunks, complete with page-level citations, similarity confidence scores, and honest admission of out-of-scope queries.",
        space_after=4)
    add_p(doc,
        "3. Role-Based Access Control (RBAC): Cryptographically secured multi-tenant access utilizing salted Scrypt hashing, featuring pre-configured Indian academic persona accounts for Students, Teachers, and Researchers.",
        space_after=4)
    add_p(doc,
        "4. Teacher Pedagogical Assessment Studio: Automated generation of university model question papers spanning eight standardized formats, tagged across Bloom's Revised Cognitive Taxonomy levels, with automated mark allocation.",
        space_after=4)
    add_p(doc,
        "5. Automated Student Examination & Grading: Interactive timed test-taking interface featuring live countdown timers, instantaneous deterministic auto-scoring for objective questions, and structured rubric-based feedback.",
        space_after=4)
    add_p(doc,
        "6. Multi-Perspective Document Synthesis: Automated generation of six structured summary types (Executive, Pedagogical, Methodological, Chronological, Technical, and Critical Analysis) and 10-dimensional cross-paper comparative matrices.",
        space_after=4)
    add_p(doc,
        "7. Multi-Modal Learning & YouTube Discovery: Contextual matching of indexed research topics with high-quality academic YouTube video lectures via YouTube Data API v3 and speech voiceover narration via browser Web Speech API.",
        space_after=4)
    add_p(doc,
        "8. Standardized Scientific Citation Engine: One-click serialization of indexed papers and synthesis summaries into IEEE, APA, MLA, and BibTeX citation standards.")

    add_heading_1(doc, "1.4 Objectives of Phase 2 Project")
    add_p(doc,
        "The Phase 2 development of INSIGHTLM was guided by the following concrete, measurable technical objectives:")
    add_p(doc,
        "• Primary Objective 1: Implement a high-performance, decoupled client-server architecture combining a responsive React 18 / TypeScript / Tailwind CSS frontend with a robust Python 3.11 / Flask 3.1 REST API gateway.",
        space_after=4)
    add_p(doc,
        "• Primary Objective 2: Engineer an optimized LangChain RAG pipeline with ChromaDB v0.5 persistent vector storage, achieving sub-500ms top-k cosine similarity retrieval latencies across multi-document corpora.",
        space_after=4)
    add_p(doc,
        "• Primary Objective 3: Establish an enterprise-grade RBAC security model backed by salted Scrypt password hashing, pre-configuring six Indian academic personas across Student, Teacher, and Researcher roles with complete privilege isolation.",
        space_after=4)
    add_p(doc,
        "• Primary Objective 4: Design and deploy a Teacher Assessment Studio capable of synthesizing examination papers across eight standardized question formats with automatic Bloom's taxonomy mapping and auto-grading capabilities.",
        space_after=4)
    add_p(doc,
        "• Primary Objective 5: Integrate multi-modal educational features, specifically automated YouTube lecture discovery via YouTube Data API v3, browser-native Text-to-Speech narration, and a multi-standard citation generator.",
        space_after=4)
    add_p(doc,
        "• Primary Objective 6: Execute comprehensive automated QA verification across unit, integration, security, and end-to-end workflows, achieving 100% test pass rates across all functional modules.")

    add_heading_1(doc, "1.5 Organization of the Report")
    add_p(doc,
        "The remainder of this dissertation is organized as follows:")
    add_p(doc,
        "• Chapter 2 (Literature Survey) presents an exhaustive review of seminal literature in dense retrieval, RAG architectures, vector indexing, and automated pedagogical evaluation, concluding with a comparative analysis of related systems.",
        space_after=4)
    add_p(doc,
        "• Chapter 3 (Problem Statement & Proposed System) formally specifies the technical research problem, analyzes the limitations of existing solutions, and articulates the innovations introduced by INSIGHTLM.",
        space_after=4)
    add_p(doc,
        "• Chapter 4 (Requirements Specification) provides detailed functional requirements (FR-01 to FR-12), non-functional constraints (NFR-01 to NFR-08), and hardware/software specifications.",
        space_after=4)
    add_p(doc,
        "• Chapter 5 (System Design & Architecture) details the 6-layer architecture, end-to-end workflows, RBAC use cases, sequence interactions, data flow diagrams (Level 0 and Level 1), and relational/vector database schemas.",
        space_after=4)
    add_p(doc,
        "• Chapter 6 (Implementation & Methodology) offers an in-depth technical walkthrough of the frontend engineering, Flask backend gateway, RAG pipeline, Scrypt authentication, 8-format question generation, auto-grading, and multi-modal integrations.",
        space_after=4)
    add_p(doc,
        "• Chapter 7 (Results and Discussion) showcases the live system implementation through 12 verified screenshots, quantitative latency benchmarks, comparative architectural analyses, and academic usability discussions.",
        space_after=4)
    add_p(doc,
        "• Chapter 8 (System Testing and Validation) documents the execution of 71 automated tests across seven distinct test suites, accompanied by security verification and performance evaluations.",
        space_after=4)
    add_p(doc,
        "• Chapter 9 (Limitations and Future Enhancements) discusses current technical constraints and identifies concrete directions for future research.",
        space_after=4)
    add_p(doc,
        "• Chapter 10 (Conclusion) summarizes the primary contributions and concludes the dissertation.")

    doc.add_page_break()

    # =============================================================
    # CHAPTER 2: LITERATURE SURVEY
    # =============================================================
    add_chapter_title(doc, "2", "LITERATURE SURVEY")

    add_heading_1(doc, "2.1 Survey of Existing Document Analysis & RAG Systems")
    add_p(doc,
        "The development of intelligent document research assistants represents the convergence of three foundational fields in Computer Science: Information Retrieval (IR), Natural Language Processing (NLP), and Dense Semantic Vector Indexing. Over the past five years, the transition from sparse term-frequency representations to dense neural representations has radically reshaped how software systems index and retrieve unstructured academic text.")

    add_heading_2(doc, "2.1.1 Evolution from Lexical Search to Dense Semantic Retrieval")
    add_p(doc,
        "Traditional information retrieval systems relied overwhelmingly on inverted index data structures and probabilistic term-weighting algorithms, most notably BM25 (Robertson et al., 2009) and TF-IDF (Salton & Buckley, 1988). While BM25 provides exceptional computational efficiency and exact lexical precision, it suffers from severe vocabulary mismatch: if a user queries 'convolutional feature map downsampling', BM25 cannot retrieve relevant passages that describe 'spatial pooling layers' unless both terms explicitly co-occur. In dense academic research literature, where complex theoretical ideas are routinely expressed using varied terminology, lexical systems exhibit unacceptably high false-negative retrieval rates.")

    add_p(doc,
        "The introduction of Transformer-based contextual language models (Vaswani et al., 2017; Devlin et al., 2019) enabled the encoding of entire sentences and paragraphs into continuous, high-dimensional vector spaces. Reimers and Gurevych (2019) introduced Sentence-BERT (SBERT), utilizing Siamese and triplet network structures to generate semantically meaningful sentence embeddings that can be compared using cosine similarity. SBERT reduced the computational cost of finding the most similar pair of sentences from 65 hours (with cross-encoder BERT) to approximately 5 seconds, laying the empirical foundation for modern dense passage retrieval (DPR) pipelines (Karpukhin et al., 2020).")

    add_heading_2(doc, "2.1.2 Foundations of Retrieval-Augmented Generation (RAG)")
    add_p(doc,
        "In their seminal paper, Lewis et al. (2020) formalized the Retrieval-Augmented Generation (RAG) architecture. Rather than relying entirely on parametric memory (the static weights of a pre-trained neural network), RAG pairs a parametric sequence-to-sequence model (such as BART or T5) with a non-parametric retrieval component (a dense vector index of Wikipedia passages). When conditioned on an input prompt, the retriever fetches top-ranked passages, which are concatenated with the query and supplied to the generator. Lewis et al. demonstrated that RAG dramatically reduces hallucinations, provides superior factual precision on open-domain question answering benchmarks (Natural Questions, WebQuestions, CuratedTREC), and allows for effortless knowledge base updates simply by updating the external index without retraining the model.")

    add_p(doc,
        "Recent surveys by Gao et al. (2023) categorize RAG systems into three architectural generations: Naive RAG (basic chunk-embed-retrieve pipelines), Advanced RAG (incorporating pre-retrieval query rewriting, chunk reranking, and sliding-window segmentation), and Modular RAG (decoupled microservices supporting dynamic routing, multi-source orchestration, and iterative self-reflective retrieval). INSIGHTLM embodies an Advanced Modular RAG design, combining sliding-window chunking, deterministic relevance filtering, multi-modal video lecture enrichment, and role-based response adaptation.")

    add_heading_2(doc, "2.1.3 High-Dimensional Vector Indexing and HNSW Graphs")
    add_p(doc,
        "A critical bottleneck in large-scale RAG systems is the nearest-neighbor search latency across millions of dense embedding vectors. Exact k-nearest-neighbor (k-NN) search requires computing the Euclidean or cosine distance against every vector in the corpus (an O(N * d) linear scan), which becomes computationally intractable for real-time interactive applications. Malkov and Yashunin (2018) resolved this challenge through the Hierarchical Navigable Small World (HNSW) graph algorithm. HNSW constructs a multi-layer graph where lower layers contain dense clusters of vectors and upper layers contain long-range 'skip' connections, analogous to skip-lists in one-dimensional data structures. HNSW achieves logarithmic search complexity (O(log N)) with state-of-the-art recall accuracy, making it the vector indexing algorithm of choice in modern embedded vector engines such as ChromaDB, Milvus, and Faiss.")

    add_heading_2(doc, "2.1.4 Automated Question Generation and Pedagogical Bloom's Taxonomy")
    add_p(doc,
        "In educational technology, automated question generation (AQG) has evolved from rigid rule-based syntactic transformations (Heilman & Smith, 2010) to neural sequence-to-sequence generation (Du et al., 2017). However, purely generative question generators often produce factually ambiguous questions or fail to adhere to standardized academic examination formats. Anderson and Krathwohl's (2001) Revised Bloom's Taxonomy categorizes cognitive educational objectives into six hierarchical levels: Remembering, Understanding, Applying, Analyzing, Evaluating, and Creating. Recent research by Wang et al. (2022) emphasizes that robust automated educational assessment requires structural format diversity (combining objective MCQs, fill-in-the-blanks, and numerical problems with subjective analytical essays) aligned explicitly with Bloom's cognitive levels. INSIGHTLM operationalizes this pedagogical theory by integrating eight distinct question formats with automated Bloom's taxonomy tagging.")

    add_heading_1(doc, "2.2 Critical Analysis & Research Gaps")
    add_p(doc,
        "Despite significant commercial and academic interest in document research tools, existing platforms exhibit prominent structural and functional limitations when evaluated against university academic requirements:")

    add_p(doc,
        "1. Academic Role Blindness: Commercial systems (such as NotebookLM, ChatPDF, and Perplexity) provide a single, undifferentiated user interface. They fail to distinguish between the pedagogical needs of a teacher drafting a balanced examination, an undergraduate student revising concepts before a test, and a researcher synthesizing methodological tradeoffs across multiple literature preprints.",
        space_after=4)

    add_p(doc,
        "2. Monolithic Single-Document Focus: Many tools restrict conversational queries to a single uploaded document at a time. They cannot perform cross-corpus synthesis, multi-paper comparative matrix extraction, or holistic concept exploration across an entire department syllabus.",
        space_after=4)

    add_p(doc,
        "3. Inadequate Pedagogical Assessment Support: Existing tools lack automated question paper generation tailored to university examination formats. None of the mainstream commercial RAG assistants provide structured 8-format examination paper synthesis, automated student test submission workflows, or deterministic auto-grading engines.",
        space_after=4)

    add_p(doc,
        "4. Absence of Multi-Modal Media Enrichment: Academic learning is fundamentally multi-modal. Textual explanations frequently require video lecture demonstrations to solidify conceptual comprehension. Existing document systems operate in total disconnection from video platforms, requiring students to manually switch contexts to find related YouTube tutorials.",
        space_after=4)

    add_p(doc,
        "5. Cryptographic Insecurity in Academic Personas: Most open-source demonstration platforms store mock credentials in plaintext or employ simplistic session spoofing without robust, memory-hard cryptographic key derivation (such as Scrypt), rendering them vulnerable to trivial unauthorized role escalation.")

    add_heading_1(doc, "2.3 Summary Table of Literature Survey")
    add_p(doc,
        "Table 2.1 presents a comprehensive comparative summary of seminal literature and commercial systems, highlighting their methodologies, key strengths, documented limitations, and direct relevance to the design of INSIGHTLM.")

    headers_2_1 = ["Author & Year", "Methodology / Architecture", "Key Strengths", "Documented Limitations", "Relevance to INSIGHTLM"]
    rows_2_1 = [
        ["Lewis et al. (2020)", "Retrieval-Augmented Generation (RAG) with BART & DPR", "Pioneered non-parametric memory; reduced hallucinations", "Evaluated on open Wikipedia; lack of multi-format document parsing", "Core foundational RAG architecture for INSIGHTLM"],
        ["Karpukhin et al. (2020)", "Dense Passage Retrieval (DPR) with dual BERT encoders", "Substantially outperformed BM25 lexical baselines in recall", "Computationally intensive offline index generation", "Informed dense embedding selection (MiniLM-L6-v2)"],
        ["Reimers & Gurevych (2019)", "Sentence-BERT (SBERT) Siamese Triplet Networks", "Enabled fast, semantically meaningful sentence embeddings", "Limited to 512 token context; requires text chunking", "Directly utilized for semantic chunk representations"],
        ["Malkov & Yashunin (2018)", "Hierarchical Navigable Small World (HNSW) Graphs", "Logarithmic vector search complexity O(log N); high recall", "Memory consumption grows with index graph density", "Core indexing engine in ChromaDB persistent store"],
        ["Gao et al. (2023)", "Modular RAG Survey & Taxonomy Analysis", "Defined unified framework for pre-, during, and post-retrieval", "Survey paper; no single end-to-end production artifact", "Guided decoupled 6-layer architecture of INSIGHTLM"],
        ["Anderson & Krathwohl (2001)", "Revised Bloom's Cognitive Taxonomy Framework", "Standardized pedagogical classification (Remember -> Create)", "Theoretical educational model; lacks software automation", "Implemented in Teacher Question Paper Studio"],
        ["Wang et al. (2022)", "Automated Assessment & Multi-Format Examination AQG", "Demonstrated benefits of multi-format question banks", "Limited format variety; lacked student auto-grading pipeline", "Inspired INSIGHTLM's 8 question format generator"],
        ["Google NotebookLM (2023)", "Proprietary Gemini RAG with Source Notes & Audio Overviews", "Polished audio generation; strong multi-document grounding", "Closed ecosystem; single generic persona; no teacher exam studio", "Benchmark for citation grounding & user experience"],
        ["ChatPDF (2023)", "Single-document PDF chat interface using OpenAI API", "Zero-configuration web utility for casual users", "Single document only; no RBAC, exams, or multi-modal video", "Illustrates baseline single-document limitations"],
        ["Perplexity AI (2023)", "Live Web RAG with inline numbered citations", "Exceptional live web freshness and source attribution", "Targeted at general search; lacks university course integration", "Informed inline citation UI and source modal design"]
    ]
    add_table_custom(doc, "Table 2.1: Comparative Summary of Literature Survey Papers and Related Systems", headers_2_1, rows_2_1, [1.1, 1.3, 1.2, 1.2, 1.2])

    doc.add_page_break()

    # =============================================================
    # CHAPTER 3: PROBLEM STATEMENT & PROPOSED SYSTEM
    # =============================================================
    add_chapter_title(doc, "3", "PROBLEM STATEMENT & PROPOSED SYSTEM")

    add_heading_1(doc, "3.1 Problem Statement")
    add_p(doc,
        "The central problem addressed by this project can be formally stated as follows:")
    add_p(doc,
        "\"To design, engineer, validate, and deploy an intelligent, role-aware academic research and learning platform—INSIGHTLM—that leverages a decoupled client-server architecture, LangChain Retrieval-Augmented Generation, and persistent ChromaDB vector storage to eliminate factual hallucinations, provide verifiable page-level citation attribution across multi-document corpora, enforce cryptographically secured Role-Based Access Control across student, teacher, and researcher personas, automate pedagogical examination generation across eight standardized formats aligned with Bloom's Taxonomy, enable deterministic instant auto-grading, and integrate contextual multi-modal video lecture discovery.\"",
        italic=True, space_after=10)

    add_heading_1(doc, "3.2 Limitations of the Existing System")
    add_p(doc,
        "The Phase 1 preliminary prototype of the Intelligent Document Research Assistant provided valuable proof-of-concept validation for basic document chat. However, systematic architectural review and testing revealed several prominent limitations:")
    add_p(doc,
        "1. Prototype Monolithic Architecture: Phase 1 proposed a tightly coupled Streamlit-based interface that intermingled presentation, business logic, and database operations in a single execution thread, precluding responsive multi-tab interactions, modern client-side state caching, and mobile responsiveness.",
        space_after=4)
    add_p(doc,
        "2. Non-Persistent In-Memory Vectors: The initial prototype stored vector embeddings in transient in-memory collections. Consequently, whenever the server process restarted, all indexed documents, chunk boundaries, and vector representations were lost, necessitating complete re-parsing and re-embedding.",
        space_after=4)
    add_p(doc,
        "3. Absence of Role-Based Security: The Phase 1 prototype featured no authenticated security boundary. All users shared an identical unstructured view, with zero distinction between student learners, examining professors, and publishing researchers.",
        space_after=4)
    add_p(doc,
        "4. No Pedagogical Examination Infrastructure: Faculty members had no capability to generate curriculum-aligned question papers, define marking schemes, or conduct automated student assessments.",
        space_after=4)
    add_p(doc,
        "5. Single-Modal Textual Isolation: The system possessed zero connectivity with external video repositories or browser-native speech synthesis, restricting user interaction entirely to static text reading.",
        space_after=4)
    add_p(doc,
        "6. Ungrounded Hallucinatory Risk: When queried regarding concepts absent from uploaded documents, the preliminary prototype occasionally generated speculative answers without explicitly declaring knowledge boundary limitations.")

    add_heading_1(doc, "3.3 Proposed System Architecture & Innovations")
    add_p(doc,
        "In Phase 2, INSIGHTLM has been completely re-architected into a modern, production-grade, decoupled client-server system that resolves every identified limitation through the following engineering innovations:")

    add_p(doc,
        "• Modern Decoupled Full-Stack Framework: A modern React 18, TypeScript, and Tailwind CSS frontend powered by Vite communicates asynchronously via a RESTful JSON API with a robust Python 3.11 / Flask 3.1 application server. This separation of concerns guarantees sub-second UI responsiveness, granular error boundary containment, and clean modular maintainability.",
        space_after=4)

    add_p(doc,
        "• Persistent ChromaDB Vector Store: Document embeddings are permanently stored in a persistent ChromaDB v0.5 collection backed by Parquet storage and HNSW graph indexing on disk (`backend/data/chroma_db`). System restarts preserve all vector representations without requiring re-computation.",
        space_after=4)

    add_p(doc,
        "• Cryptographic RBAC with Salted Scrypt: Complete multi-role authorization enforcing strict privilege boundaries between Students, Teachers, and Researchers. Passwords are never stored in plaintext, but rather hashed using salted, memory-hard Scrypt key derivation.",
        space_after=4)

    add_p(doc,
        "• 8-Format Pedagogical Question Paper Studio: Faculty members can instantly generate balanced examination papers containing Multiple Choice Questions, Fill in the Blanks, True/False, Short Answer, Numerical Problems, Assertion-Reason, Match the Following, and Long Analytical Essays, tagged with Bloom's cognitive taxonomy levels.",
        space_after=4)

    add_p(doc,
        "• Deterministic Auto-Grading Engine: Timed student exam submissions undergo instant automated evaluation for objective question items, computing overall percentages and presenting question-by-question explanations.",
        space_after=4)

    add_p(doc,
        "• Multi-Modal Lecture Integration: Context-aware YouTube lecture recommendations via YouTube Data API v3 and browser-native text-to-speech audio narration provide a rich, multi-modal educational experience.",
        space_after=4)

    add_p(doc,
        "• 10-Dimensional Cross-Paper Comparison Matrix: Researchers can synthesize methodological frameworks across up to five papers simultaneously, evaluating Problem Formulation, Core Methodology, Dataset, Empirical Metrics, Strengths, Limitations, and Research Gaps.",
        space_after=4)

    add_p(doc,
        "• Multi-Style Scientific Citation Generator: Automatic compilation of citations in IEEE, APA, MLA, and BibTeX standards for any uploaded paper or synthesized answer.")

    add_heading_1(doc, "3.4 Key Features and Value Propositions")
    add_p(doc,
        "INSIGHTLM delivers distinct value propositions tailored to the three primary user segments of an academic engineering institution:")

    add_p(doc,
        "1. Value for Students: Transforms passive textbook reading into an active, conversational learning dialogue. Students can ask conceptual questions, review grounded citations, take timed practice tests with instant feedback, and watch curated YouTube lectures on challenging topics.",
        space_after=4)

    add_p(doc,
        "2. Value for Teachers: Automates the laborious task of drafting balanced examination papers and quizzes across eight standardized formats, provides complete control over question difficulty and marks, and streamlines the evaluation of student submissions.",
        space_after=4)

    add_p(doc,
        "3. Value for Researchers: Accelerates the literature review process by automating multi-document synthesis, cross-methodology comparisons, research gap discovery, and academic bibliography generation.",
        space_after=4)

    add_p(doc,
        "4. Value for the Institution: Provides a self-contained, privacy-preserving research intelligence platform that runs entirely within the university computational infrastructure without exposing proprietary curricula or student examination data to third-party data-scraping platforms.")

    doc.add_page_break()

    # =============================================================
    # CHAPTER 4: REQUIREMENTS SPECIFICATION
    # =============================================================
    add_chapter_title(doc, "4", "REQUIREMENTS SPECIFICATION")

    add_heading_1(doc, "4.1 Functional Requirements")
    add_p(doc,
        "Functional requirements define the core capabilities, operations, and services that INSIGHTLM must provide to its end users. Table 4.1 specifies the twelve primary functional requirements (FR-01 to FR-12) implemented and verified in the Phase 2 system.")

    headers_4_1 = ["Req ID", "Requirement Name", "Detailed Functional Description", "Target Persona / Role", "Verification Status"]
    rows_4_1 = [
        ["FR-01", "User Authentication & Scrypt Cryptography", "Platform must authenticate users via unique username/email and password verified against salted Scrypt hashes in users.json; enforce password length >6 chars and reject invalid logins with HTTP 401.", "All Roles", "Verified (Suite 1)"],
        ["FR-02", "Role-Based Access Control (RBAC)", "System must isolate feature sets based on user role (Student, Teacher, Researcher); enforce strict 403 Forbidden blocks when unauthorized roles attempt privileged operations.", "All Roles", "Verified (Suite 1, 2)"],
        ["FR-03", "Multi-Page PDF Ingestion & Validation", "Platform must accept PDF file uploads, validate file headers, parse raw text page-by-page via PyPDF, normalize whitespace, and reject empty, corrupted, or non-PDF files with HTTP 400.", "All Roles", "Verified (Suite 5)"],
        ["FR-04", "Semantic Chunking & Metadata Binding", "System must segment extracted text using LangChain RecursiveCharacterTextSplitter (chunk size: 1000, overlap: 200) and bind chunk index, page number, and doc ID metadata.", "System Engine", "Verified (Suite 6)"],
        ["FR-05", "Vector Embedding & HNSW Persistent Index", "Platform must compute 384-dimensional dense vectors using all-MiniLM-L6-v2 and store them persistently in ChromaDB v0.5 collection with HNSW graph indexing.", "System Engine", "Verified (Suite 6)"],
        ["FR-06", "Document-Grounded RAG Querying", "Assistant must retrieve top-k (k=4) relevant chunks via cosine similarity, synthesize a factual answer strictly grounded in context, and present inline page citations and excerpts.", "Student, Researcher", "Verified (Suite 3, 5)"],
        ["FR-07", "Honest Domain Boundary Admission", "When a user query falls outside the indexed document corpus, the assistant must honestly declare the absence of grounding evidence rather than hallucinating answers.", "All Roles", "Verified (Suite 3)"],
        ["FR-08", "8-Format Question Paper Generation", "Teacher studio must generate questions across 8 formats (MCQ, Fill Blanks, True/False, Short Answer, Numerical, Assertion-Reason, Match, Long Essay) with marks and Bloom's levels.", "Teacher", "Verified (Suite 2)"],
        ["FR-09", "Automated Exam Submission & Instant Grading", "Students must attempt timed tests with a countdown timer; the auto-grading engine must score objective questions deterministically and provide rubric feedback.", "Student, Teacher", "Verified (Suite 2)"],
        ["FR-10", "Multi-Perspective Literature Summarization", "System must generate six distinct structured summary modes (Executive, Pedagogical, Methodological, Chronological, Technical, Critical Analysis) for any document.", "All Roles", "Verified (Suite 5)"],
        ["FR-11", "10-Dimensional Paper Comparison Matrix", "Platform must compare 2 to 5 research papers simultaneously across 10 structured dimensions and render an interactive comparative matrix.", "Researcher, Teacher", "Verified (Suite 5)"],
        ["FR-12", "Multi-Modal YouTube Discovery & Citation Engine", "System must match indexed topics with YouTube lectures via YouTube Data API v3, provide Web Speech TTS narration, and export citations in IEEE, APA, MLA, and BibTeX.", "All Roles", "Verified (Suite 2, 5)"]
    ]
    add_table_custom(doc, "Table 4.1: Functional Requirements Specification (FR-01 to FR-12)", headers_4_1, rows_4_1, [0.8, 1.4, 2.3, 1.0, 1.0])

    add_heading_1(doc, "4.2 Non-Functional Requirements")
    add_p(doc,
        "Non-functional requirements specify the operational quality attributes, performance benchmarks, security standards, and reliability criteria that govern system execution. Table 4.2 details the eight non-functional requirements (NFR-01 to NFR-08).")

    headers_4_2 = ["Req ID", "Quality Dimension", "Non-Functional Specification & Constraint", "Target Metric", "Observed Metric"]
    rows_4_2 = [
        ["NFR-01", "Response Latency", "End-to-end RAG question answering response latency for standard queries must remain responsive under interactive conditions.", "< 1,000 ms", "380–480 ms (Avg: 412 ms)"],
        ["NFR-02", "Vector Query Latency", "ChromaDB HNSW similarity search across indexed chunk collections must execute within sub-second thresholds.", "< 200 ms", "18–45 ms (Avg: 28 ms)"],
        ["NFR-03", "Cryptographic Security", "All user passwords must be hashed using salted Scrypt key derivation; zero plaintext passwords in persistent storage or API responses.", "Zero plaintext leaks", "Zero leaks (Scrypt salted verified)"],
        ["NFR-04", "Data Sanitization", "All API responses from /api/settings and /api/health must strictly scrub raw API keys, secrets, and server environment variables.", "100% Sanitized", "100% Sanitized (Suite 4 verified)"],
        ["NFR-05", "Concurrent Burst Reliability", "Platform must process concurrent burst requests without connection drops, HTTP 500 errors, or memory leaks.", "> 99% Success Rate", "100% Success (25/25 Burst Test)"],
        ["NFR-06", "Persistent Storage Integrity", "Vector indices, document metadata, question papers, and user accounts must survive server process restarts without data loss.", "Zero Data Loss", "Verified (ChromaDB + JSON persistence)"],
        ["NFR-07", "Input Validation & Injection Defense", "API endpoints must block path traversal payloads (e.g. ../../) and sanitize cross-site scripting (XSS) inputs.", "100% Block Rate", "100% Block Rate (Suite 4 verified)"],
        ["NFR-08", "Cross-Browser Compatibility", "Web client must render consistently without visual layout breakage across modern Chromium, Gecko, and WebKit browsers.", "100% Functional", "Verified (Edge, Chrome, Firefox)"]
    ]
    add_table_custom(doc, "Table 4.2: Non-Functional Requirements Specification (NFR-01 to NFR-08)", headers_4_2, rows_4_2, [0.8, 1.3, 2.5, 1.0, 1.2])

    add_heading_1(doc, "4.3 Hardware Requirements")
    add_p(doc,
        "Table 4.3 outlines the minimum and recommended hardware configurations required for local development, server deployment, and client workstations accessing the INSIGHTLM system.")

    headers_4_3 = ["Hardware Component", "Minimum Specification (Development / Server)", "Recommended Specification (Institutional Production)", "Client Workstation Specification"]
    rows_4_3 = [
        ["Processor (CPU)", "Intel Core i5 / AMD Ryzen 5 (4 Cores, 2.5 GHz)", "Intel Core i7 / AMD Ryzen 7 / Xeon (8+ Cores, 3.6 GHz)", "Intel Core i3 / AMD Dual-Core (2.0 GHz)"],
        ["System Memory (RAM)", "8 GB DDR4", "16 GB to 32 GB DDR4/DDR5", "4 GB RAM"],
        ["Persistent Storage", "500 MB free space for code, DB & sample docs", "10 GB SSD (NVMe preferred for fast vector I/O)", "Standard Browser Cache (~100 MB)"],
        ["Network Interface", "Standard Localhost / 100 Mbps LAN", "1 Gbps Ethernet Interface for institutional intranet", "Standard Broadband / Wi-Fi (10 Mbps)"],
        ["Display Resolution", "1280 x 720 (HD)", "1920 x 1080 (Full HD, 1080p)", "1366 x 768 or higher"]
    ]
    add_table_custom(doc, "Table 4.3: Hardware & Computational Requirements", headers_4_3, rows_4_3, [1.3, 1.9, 2.0, 1.4])

    add_heading_1(doc, "4.4 Software Requirements")
    add_p(doc,
        "Table 4.4 details the software operating environment, runtime dependencies, programming languages, and specialized libraries utilized in the INSIGHTLM platform.")

    headers_4_4 = ["Software Layer", "Technology / Framework Selected", "Version", "Functional Role in INSIGHTLM"]
    rows_4_4 = [
        ["Operating System", "Microsoft Windows 11 / Linux Ubuntu 22.04 LTS", "64-bit", "Host execution environment for client and server"],
        ["Backend Runtime", "Python", "3.11.x", "Core backend runtime for REST API and AI pipeline"],
        ["Web Framework", "Flask", "3.1.x", "Lightweight, high-performance WSGI web application server"],
        ["Frontend Runtime", "Node.js & npm", "v18.x / v20.x", "JavaScript runtime for building and bundling client UI"],
        ["UI Library", "React & TypeScript", "18.3.x / 5.x", "Declarative, type-safe reactive user interface components"],
        ["Build Tool", "Vite", "5.x", "Fast development server and optimized frontend production bundler"],
        ["Styling Framework", "Tailwind CSS", "3.4.x", "Utility-first responsive design and academic styling"],
        ["Vector Database", "ChromaDB", "0.5.x", "Persistent vector database with embedded HNSW indexing"],
        ["RAG Orchestrator", "LangChain Core & Community", "0.1.x / 0.2.x", "Pipeline orchestration for document loading, splitting, and RAG"],
        ["PDF Parser", "PyPDF", "4.x / 5.x", "Pure-Python PDF text and page metadata extraction engine"],
        ["Testing Framework", "Pytest & Playwright", "8.x / 1.4x", "Automated unit, integration, security, and UI testing suite"],
        ["Security / Hashing", "Werkzeug Security (Scrypt)", "3.1.x", "Salted Scrypt cryptographic key derivation and verification"]
    ]
    add_table_custom(doc, "Table 4.4: Software Stack & Technical Dependency Specifications", headers_4_4, rows_4_4, [1.2, 1.6, 0.9, 2.8])

    doc.add_page_break()
    print("Chapters 1 to 4 built successfully.")
