import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Arrow

OUT_DIR = r"C:\Users\cvenu\.gemini\antigravity\scratch\intelligent-research-assistant\INSIGHTLM_PHASE2_REPORT\INSIGHTLM_Diagrams"
os.makedirs(OUT_DIR, exist_ok=True)

plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['font.family'] = 'sans-serif'

# 1. SYSTEM ARCHITECTURE DIAGRAM
def draw_system_architecture():
    fig, ax = plt.subplots(figsize=(13, 9), dpi=300)
    ax.set_xlim(0, 13)
    ax.set_ylim(0, 9)
    ax.axis('off')

    # Title
    ax.text(6.5, 8.6, "INSIGHTLM: 6-LAYER SYSTEM ARCHITECTURE", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#0f172a')
    ax.text(6.5, 8.25, "Decoupled Client-Server Architecture with LangChain RAG & ChromaDB Vector Store", 
            ha='center', va='center', fontsize=10, style='italic', color='#475569')

    layers = [
        {"y": 6.8, "h": 1.1, "title": "Layer 1: Client Presentation Layer (Vite + React 18 + TypeScript)", 
         "bg": "#e0f2fe", "border": "#0284c7",
         "items": ["Student Dashboard\n(Aarav & Priya)", "Teacher Studio\n(Rahul & Sneha)", "Researcher Hub\n(Arjun & Ananya)", "8-Format Question UI\n& Timed Exam Modal", "YouTube Curated\nResearch Shelves", "Citation Generator\n(IEEE/APA/MLA/BibTeX)"]},
        
        {"y": 5.4, "h": 1.1, "title": "Layer 2: Application Gateway & REST API Layer (Python Flask 3.1)", 
         "bg": "#f0fdf4", "border": "#16a34a",
         "items": ["CORS & Proxy Handler\n(Port 5173 -> 8000)", "RBAC Auth Middleware\n(Session & Scrypt Verify)", "Document Ingest API\n(/api/documents/*)", "RAG Query Endpoint\n(/api/rag/query)", "Teacher Assessment API\n(/api/teacher/questions)", "YouTube Recommender API\n(/api/youtube/*)"]},
        
        {"y": 4.0, "h": 1.1, "title": "Layer 3: RAG Orchestration & Document Processing Layer (LangChain Core)", 
         "bg": "#fef3c7", "border": "#d97706",
         "items": ["PyPDF Document Loader\n& Layout Normalizer", "Recursive Text Splitter\n(Chunk:1000, Overlap:200)", "Semantic Context Filter\n& Relevance Scoring", "Prompt Augmentation\n& Source Grounding", "Bloom's Taxonomy\nQuestion Generator", "Deterministic Auto-Grader\n& Rubric Engine"]},

        {"y": 2.6, "h": 1.1, "title": "Layer 4: Vector Storage & Similarity Search Layer (ChromaDB v0.5)", 
         "bg": "#f3e8ff", "border": "#9333ea",
         "items": ["ChromaDB Client\n(Persistent Storage)", "Collection Manager\n(documents_collection)", "HNSW Index Graph\n(High-Dim Space)", "Cosine Similarity Engine\n(Top-k Chunk Match)", "Metadata Store\n(Doc ID, Page, Chunk)", "Vector Parquet Storage\n(Zero-Loss Checkpoints)"]},

        {"y": 1.2, "h": 1.1, "title": "Layer 5: AI Inference & External Services Layer", 
         "bg": "#fae8ff", "border": "#c026d3",
         "items": ["HuggingFace Embeddings\n(all-MiniLM-L6-v2)", "YouTube Data API v3\n(Transcript & Metadata)", "DuckDuckGo Academic API\n(Live Web Fallback)", "Web Speech API\n(Browser TTS Audio)", "LLM Inference Proxy\n(Context Grounded)", "BibTeX Format Engine\n(IEEE/APA Serializer)"]},

        {"y": 0.05, "h": 0.95, "title": "Layer 6: Security, Storage & Data Persistence Layer", 
         "bg": "#f1f5f9", "border": "#475569",
         "items": ["Scrypt Salted User DB\n(backend/data/users.json)", "Indexed PDF Repository\n(backend/uploads/)", "Question Bank DB\n(question_papers.json)", "Student Submissions DB\n(submissions.json)", "Audit Trail & History\n(history_items.json)", "System Settings & Keys\n(Sanitized Configuration)"]}
    ]

    for layer in layers:
        # Layer container box
        rect = FancyBboxPatch((0.5, layer["y"]), 12.0, layer["h"],
                              boxstyle="round,pad=0.08,rounding_size=0.15",
                              facecolor=layer["bg"], edgecolor=layer["border"], linewidth=1.5)
        ax.add_patch(rect)
        # Layer Header
        ax.text(0.7, layer["y"] + layer["h"] - 0.22, layer["title"], 
                fontsize=9.5, fontweight='bold', color=layer["border"])

        # Inner item cards
        n_items = len(layer["items"])
        item_w = 11.6 / n_items
        for i, item in enumerate(layer["items"]):
            ix = 0.7 + i * item_w
            iy = layer["y"] + 0.1
            item_rect = FancyBboxPatch((ix, iy), item_w - 0.15, layer["h"] - 0.45,
                                       boxstyle="round,pad=0.04,rounding_size=0.08",
                                       facecolor="white", edgecolor=layer["border"], linewidth=0.8)
            ax.add_patch(item_rect)
            ax.text(ix + (item_w - 0.15)/2, iy + (layer["h"] - 0.45)/2, item,
                    ha='center', va='center', fontsize=7.2, color='#1e293b')

    # Connectors between layers
    for y_conn in [6.6, 5.2, 3.8, 2.4, 1.0]:
        ax.annotate('', xy=(6.5, y_conn), xytext=(6.5, y_conn + 0.2),
                    arrowprops=dict(arrowstyle='<->', color='#64748b', lw=1.5))

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, "system_architecture.png"), dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved system_architecture.png")

# 2. SYSTEM WORKFLOW DIAGRAM
def draw_system_workflow():
    fig, ax = plt.subplots(figsize=(14, 8), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 8)
    ax.axis('off')

    ax.text(7.0, 7.6, "INSIGHTLM: END-TO-END RAG & PEDAGOGICAL WORKFLOW", 
            ha='center', va='center', fontsize=14, fontweight='bold', color='#0f172a')
    ax.text(7.0, 7.25, "Document Ingestion, Semantic Chunking, Vector Retrieval, Question Generation & Auto-Grading", 
            ha='center', va='center', fontsize=9.5, style='italic', color='#475569')

    # Steps definition (2 rows: Row 1 Ingestion & Indexing, Row 2 Query & Question Generation)
    row1_steps = [
        ("Step 1: Document Upload", "PDF Ingestion via Web UI\n(Research paper / Textbook)", "#dbeafe", "#1d4ed8"),
        ("Step 2: PyPDF Extraction", "Extract raw text per page\nStrip noise & header/footer", "#e0e7ff", "#4338ca"),
        ("Step 3: Recursive Splitting", "LangChain Character Splitter\nChunk:1000, Overlap:200", "#ede9fe", "#6d28d9"),
        ("Step 4: Vector Embedding", "all-MiniLM-L6-v2 Model\n384-dimensional dense vectors", "#fae8ff", "#a21caf"),
        ("Step 5: ChromaDB HNSW", "Persistent Vector Store\nIndex chunk vectors & metadata", "#fce7f3", "#be185d")
    ]

    row2_steps = [
        ("Step 6: User Query / Request", "Student Question / Teacher Request\nRole identified by RBAC", "#ffedd5", "#c2410c"),
        ("Step 7: Query Vectorization", "Query embedded into 384-D\nSemantic intent matching", "#fef3c7", "#b45309"),
        ("Step 8: Similarity Search", "ChromaDB Cosine Distance\nTop-k (k=4) relevant chunks", "#ecfccb", "#4d7c0f"),
        ("Step 9: Prompt Grounding", "Augment LLM prompt with\nexact chunk context & pages", "#dcfce7", "#15803d"),
        ("Step 10: Multi-Task Output", "A) Grounded Q&A + Citation\nB) 8-Format Exam Papers\nC) Auto-Graded Student Tests", "#ccfbf1", "#0f766e")
    ]

    # Draw Row 1
    ax.text(0.5, 6.4, "PHASE A: DOCUMENT INGESTION & VECTOR INDEXING PIPELINE", fontsize=10, fontweight='bold', color='#1e3a8a')
    for i, (title, desc, bg, border) in enumerate(row1_steps):
        x = 0.5 + i * 2.65
        y = 4.8
        w = 2.45
        h = 1.35
        rect = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05,rounding_size=0.1",
                              facecolor=bg, edgecolor=border, linewidth=1.5)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h - 0.25, title, ha='center', va='center', fontsize=8.5, fontweight='bold', color=border)
        ax.text(x + w/2, y + 0.45, desc, ha='center', va='center', fontsize=7.2, color='#1e293b')

        if i < len(row1_steps) - 1:
            ax.annotate('', xy=(x + w + 0.2, y + h/2), xytext=(x + w, y + h/2),
                        arrowprops=dict(arrowstyle='->', color='#2563eb', lw=1.5))

    # Curve connector from step 5 to step 8
    ax.annotate('', xy=(11.5, 3.2), xytext=(11.5, 4.8),
                arrowprops=dict(arrowstyle='->', color='#9333ea', lw=2, linestyle='dashed'))
    ax.text(12.2, 4.0, "Vectors Indexed\nReady for Search", ha='center', va='center', fontsize=7.5, fontweight='bold', color='#9333ea')

    # Draw Row 2
    ax.text(0.5, 3.8, "PHASE B: SEMANTIC RETRIEVAL, SYNTHESIS & ASSESSMENT PIPELINE", fontsize=10, fontweight='bold', color='#065f46')
    for i, (title, desc, bg, border) in enumerate(row2_steps):
        x = 0.5 + i * 2.65
        y = 1.9
        w = 2.45
        h = 1.45
        rect = FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05,rounding_size=0.1",
                              facecolor=bg, edgecolor=border, linewidth=1.5)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h - 0.25, title, ha='center', va='center', fontsize=8.5, fontweight='bold', color=border)
        ax.text(x + w/2, y + 0.5, desc, ha='center', va='center', fontsize=7.2, color='#1e293b')

        if i < len(row2_steps) - 1:
            ax.annotate('', xy=(x + w + 0.2, y + h/2), xytext=(x + w, y + h/2),
                        arrowprops=dict(arrowstyle='->', color='#059669', lw=1.5))

    # Feedback Loop: Auto-grading back into Student Learning Profile
    rect_feed = FancyBboxPatch((0.5, 0.4), 13.0, 0.9, boxstyle="round,pad=0.05,rounding_size=0.1",
                               facecolor="#f8fafc", edgecolor="#64748b", linewidth=1.2)
    ax.add_patch(rect_feed)
    ax.text(7.0, 0.85, "Continuous Pedagogical Feedback Loop", ha='center', va='center', fontsize=8.5, fontweight='bold', color='#334155')
    ax.text(7.0, 0.55, "Auto-grading marks and feedback update student mastery analytics; Teachers refine question papers; YouTube recommender surfaces weak-topic lectures.",
            ha='center', va='center', fontsize=7.2, color='#475569')

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, "system_workflow.png"), dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved system_workflow.png")

# 3. USE CASE DIAGRAM
def draw_use_case_diagram():
    fig, ax = plt.subplots(figsize=(13, 9), dpi=300)
    ax.set_xlim(0, 13)
    ax.set_ylim(0, 9)
    ax.axis('off')

    ax.text(6.5, 8.6, "INSIGHTLM: ROLE-BASED ACCESS CONTROL (RBAC) USE CASE MODEL", 
            ha='center', va='center', fontsize=14, fontweight='bold', color='#0f172a')
    ax.text(6.5, 8.25, "Interactions for Student, Teacher, Researcher, and System Administrator", 
            ha='center', va='center', fontsize=9.5, style='italic', color='#475569')

    # System boundary box
    sys_box = FancyBboxPatch((3.2, 0.5), 6.6, 7.4, boxstyle="round,pad=0.1,rounding_size=0.2",
                             facecolor="#f8fafc", edgecolor="#3b82f6", linewidth=2, linestyle='--')
    ax.add_patch(sys_box)
    ax.text(6.5, 7.6, "INSIGHTLM SYSTEM BOUNDARY", ha='center', va='center', fontsize=11, fontweight='bold', color='#1d4ed8')

    # Actors
    actors = [
        {"name": "STUDENT\n(Aarav & Priya)", "x": 1.2, "y": 6.2, "color": "#2563eb"},
        {"name": "TEACHER\n(Rahul & Sneha)", "x": 1.2, "y": 2.6, "color": "#059669"},
        {"name": "RESEARCHER\n(Arjun & Ananya)", "x": 11.8, "y": 6.2, "color": "#7c3aed"},
        {"name": "ADMINISTRATOR\n(System Lead)", "x": 11.8, "y": 2.6, "color": "#dc2626"}
    ]

    for act in actors:
        # Draw stick-figure like representation (circle + lines)
        circle = patches.Circle((act["x"], act["y"] + 0.4), 0.25, facecolor="white", edgecolor=act["color"], linewidth=2)
        ax.add_patch(circle)
        ax.plot([act["x"], act["x"]], [act["y"] + 0.15, act["y"] - 0.25], color=act["color"], lw=2)
        ax.plot([act["x"] - 0.25, act["x"] + 0.25], [act["y"], act["y"]], color=act["color"], lw=2)
        ax.plot([act["x"], act["x"] - 0.2], [act["y"] - 0.25, act["y"] - 0.55], color=act["color"], lw=2)
        ax.plot([act["x"], act["x"] + 0.2], [act["y"] - 0.25, act["y"] - 0.55], color=act["color"], lw=2)
        ax.text(act["x"], act["y"] - 0.85, act["name"], ha='center', va='center', fontsize=8, fontweight='bold', color=act["color"])

    # Use Cases (Ellipses in center)
    use_cases = [
        {"id": "uc1", "text": "Authenticate via Salted Scrypt\n(Unique Dev Credentials)", "y": 7.0, "w": 4.5, "actors": [0, 1, 2, 3]},
        {"id": "uc2", "text": "Upload & Manage Documents\n(PDF Text & Page Ingestion)", "y": 6.2, "w": 4.2, "actors": [0, 1, 2]},
        {"id": "uc3", "text": "Query Document-Grounded RAG\n(Semantic Retrieval + Citations)", "y": 5.4, "w": 4.5, "actors": [0, 1, 2]},
        {"id": "uc4", "text": "Take Timed Exams & Quizzes\n(Auto-Graded Submissions)", "y": 4.6, "w": 4.2, "actors": [0]},
        {"id": "uc5", "text": "Generate 8-Format Questions\n(MCQ, Blanks, Essay, Numerical)", "y": 3.8, "w": 4.5, "actors": [1]},
        {"id": "uc6", "text": "Grade Submissions & Set Rubrics\n(Instant Feedback & Mastery)", "y": 3.0, "w": 4.5, "actors": [1]},
        {"id": "uc7", "text": "10-Dimensional Paper Comparison\n(Cross-Corpus Synthesis)", "y": 2.2, "w": 4.5, "actors": [2]},
        {"id": "uc8", "text": "Generate Standardized Citations\n(IEEE, APA, MLA, BibTeX)", "y": 1.4, "w": 4.2, "actors": [2]},
        {"id": "uc9", "text": "Configure System & Vector DB\n(ChromaDB Index Maintenance)", "y": 0.8, "w": 4.5, "actors": [3]}
    ]

    for uc in use_cases:
        ellipse = patches.Ellipse((6.5, uc["y"]), uc["w"], 0.65, facecolor="#ffffff", edgecolor="#475569", linewidth=1.2)
        ax.add_patch(ellipse)
        ax.text(6.5, uc["y"], uc["text"], ha='center', va='center', fontsize=7.2, color="#0f172a")

        # Connect actors to use cases
        for act_idx in uc["actors"]:
            act = actors[act_idx]
            line_color = act["color"]
            if act["x"] < 6.5:
                # Left actor
                ax.plot([act["x"] + 0.4, 6.5 - uc["w"]/2], [act["y"], uc["y"]], color=line_color, lw=0.9, alpha=0.7)
            else:
                # Right actor
                ax.plot([act["x"] - 0.4, 6.5 + uc["w"]/2], [act["y"], uc["y"]], color=line_color, lw=0.9, alpha=0.7)

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, "use_case_diagram.png"), dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved use_case_diagram.png")

# 4. SEQUENCE DIAGRAM
def draw_sequence_diagram():
    fig, ax = plt.subplots(figsize=(13, 9), dpi=300)
    ax.set_xlim(0, 13)
    ax.set_ylim(0, 9)
    ax.axis('off')

    ax.text(6.5, 8.6, "INSIGHTLM: RAG QUERY & ASSESSMENT EXECUTION SEQUENCE", 
            ha='center', va='center', fontsize=14, fontweight='bold', color='#0f172a')
    ax.text(6.5, 8.25, "Message Interactions between Client, Flask API, LangChain Engine, ChromaDB, and Auto-Grader", 
            ha='center', va='center', fontsize=9.5, style='italic', color='#475569')

    lifelines = [
        ("User / Client\n(React UI)", 1.2, "#3b82f6"),
        ("Flask API\n(server.py)", 3.8, "#10b981"),
        ("LangChain Core\n(RAG Pipeline)", 6.5, "#f59e0b"),
        ("ChromaDB\n(Vector Store)", 9.2, "#8b5cf6"),
        ("Auto-Grader /\nAssessment DB", 11.8, "#ec4899")
    ]

    # Draw lifelines
    for name, x, col in lifelines:
        box = FancyBboxPatch((x - 1.0, 7.3), 2.0, 0.7, boxstyle="round,pad=0.05,rounding_size=0.1",
                             facecolor="white", edgecolor=col, linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, 7.65, name, ha='center', va='center', fontsize=8, fontweight='bold', color=col)
        # Lifeline vertical dashed line
        ax.plot([x, x], [7.3, 0.8], color="#cbd5e1", linestyle="--", lw=1.2)

    messages = [
        # Ingestion & Query sequence
        (1.2, 3.8, 6.8, "1: POST /api/documents/upload (PDF File)", "#2563eb"),
        (3.8, 6.5, 6.4, "2: PyPDF Parse & RecursiveSplit(1000, 200)", "#059669"),
        (6.5, 9.2, 6.0, "3: Store Embeddings & Metadata in HNSW", "#d97706"),
        (9.2, 3.8, 5.6, "4: Indexing Ack (Chunk IDs & Document ID)", "#7c3aed"),
        (3.8, 1.2, 5.2, "5: HTTP 201 Created (Document Indexed)", "#059669"),

        (1.2, 3.8, 4.6, "6: POST /api/rag/query (User Question + Role)", "#2563eb"),
        (3.8, 6.5, 4.2, "7: Embed Query & Request Top-k Context", "#059669"),
        (6.5, 9.2, 3.8, "8: Cosine Similarity Search (k=4)", "#d97706"),
        (9.2, 6.5, 3.4, "9: Return Matching Chunks + Page Metas", "#7c3aed"),
        (6.5, 3.8, 3.0, "10: Synthesize Grounded Answer + Citations", "#d97706"),
        (3.8, 1.2, 2.6, "11: HTTP 200 OK (Grounded Response + Sources)", "#059669"),

        # Assessment sequence
        (1.2, 3.8, 2.0, "12: POST /api/student/exam/submit (Answers)", "#2563eb"),
        (3.8, 11.8, 1.6, "13: Evaluate Objective & Subjective Questions", "#db2777"),
        (11.8, 3.8, 1.2, "14: Store Submission & Generate Rubric Score", "#db2777"),
        (3.8, 1.2, 0.9, "15: HTTP 200 OK (Score, Corrections & Explanations)", "#059669")
    ]

    for x_from, x_to, y, text, col in messages:
        # Determine direction
        if x_from < x_to:
            ax.annotate('', xy=(x_to, y), xytext=(x_from, y),
                        arrowprops=dict(arrowstyle='->', color=col, lw=1.3))
            ax.text((x_from + x_to)/2, y + 0.12, text, ha='center', va='bottom', fontsize=7.2, fontweight='semibold', color=col)
        else:
            ax.annotate('', xy=(x_to, y), xytext=(x_from, y),
                        arrowprops=dict(arrowstyle='->', color=col, lw=1.3, linestyle='--'))
            ax.text((x_from + x_to)/2, y + 0.12, text, ha='center', va='bottom', fontsize=7.2, fontweight='semibold', color=col)

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, "sequence_diagram.png"), dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved sequence_diagram.png")

# 5. DATA FLOW DIAGRAM (DFD)
def draw_data_flow_diagram():
    fig, ax = plt.subplots(figsize=(13, 9), dpi=300)
    ax.set_xlim(0, 13)
    ax.set_ylim(0, 9)
    ax.axis('off')

    ax.text(6.5, 8.6, "INSIGHTLM: LEVEL 0 & LEVEL 1 DATA FLOW DIAGRAM (DFD)", 
            ha='center', va='center', fontsize=14, fontweight='bold', color='#0f172a')
    ax.text(6.5, 8.25, "Information Flow across External Entities, Functional Processes, and Data Stores", 
            ha='center', va='center', fontsize=9.5, style='italic', color='#475569')

    # External Entities (Rectangles)
    ext_entities = [
        ("STUDENT\nUSER", 1.2, 6.5, "#dbeafe", "#1d4ed8"),
        ("TEACHER\nUSER", 1.2, 3.8, "#dcfce7", "#15803d"),
        ("RESEARCHER\nUSER", 1.2, 1.2, "#f3e8ff", "#7e22ce"),
        ("YOUTUBE / WEB\nAPIs", 11.8, 4.5, "#fef3c7", "#b45309")
    ]

    for name, x, y, bg, border in ext_entities:
        box = FancyBboxPatch((x - 0.9, y - 0.4), 1.8, 0.8, boxstyle="square,pad=0",
                             facecolor=bg, edgecolor=border, linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, name, ha='center', va='center', fontsize=7.8, fontweight='bold', color=border)

    # Processes (Circles / Round Rectangles)
    processes = [
        ("1.0\nAuth & RBAC\nVerification", 4.0, 7.0, "#0284c7"),
        ("2.0\nDocument Parsing\n& Chunking", 4.0, 4.8, "#059669"),
        ("3.0\nChromaDB Vector\nIndexing", 6.8, 4.8, "#7c3aed"),
        ("4.0\nSemantic Query\n& Top-k Match", 6.8, 7.0, "#d97706"),
        ("5.0\n8-Format Question\nGeneration", 4.0, 2.6, "#2563eb"),
        ("6.0\nAutomated Exam\nGrading Engine", 6.8, 2.6, "#db2777"),
        ("7.0\n10-D Literature\nComparison", 4.0, 0.8, "#4b5563"),
        ("8.0\nCitation & BibTeX\nFormatter", 6.8, 0.8, "#0d9488")
    ]

    for pnum_title, x, y, col in processes:
        circle = patches.Circle((x, y), 0.65, facecolor="white", edgecolor=col, linewidth=1.8)
        ax.add_patch(circle)
        ax.text(x, y, pnum_title, ha='center', va='center', fontsize=6.8, fontweight='bold', color=col)

    # Data Stores (Open-ended rectangles: D1, D2, D3, D4)
    datastores = [
        ("D1: Users & Salted Credentials", 9.8, 7.2),
        ("D2: Documents & Upload Cache", 9.8, 5.4),
        ("D3: ChromaDB Vector Parquet Store", 9.8, 3.6),
        ("D4: Question Bank & Student Submissions", 9.8, 1.8)
    ]

    for name, x, y in datastores:
        # Draw open rectangle (top, bottom, left line)
        w, h = 2.6, 0.6
        ax.plot([x - w/2, x + w/2], [y + h/2, y + h/2], color="#334155", lw=1.5)
        ax.plot([x - w/2, x + w/2], [y - h/2, y - h/2], color="#334155", lw=1.5)
        ax.plot([x - w/2, x - w/2], [y - h/2, y + h/2], color="#334155", lw=1.5)
        ax.text(x, y, name, ha='center', va='center', fontsize=7.2, fontweight='bold', color="#1e293b")

    # Connect Entities to Processes
    ax.annotate('', xy=(3.35, 6.8), xytext=(2.1, 6.6), arrowprops=dict(arrowstyle='->', color='#1d4ed8', lw=1.2))
    ax.annotate('', xy=(3.35, 4.8), xytext=(2.1, 4.0), arrowprops=dict(arrowstyle='->', color='#15803d', lw=1.2))
    ax.annotate('', xy=(3.35, 2.6), xytext=(2.1, 3.7), arrowprops=dict(arrowstyle='->', color='#15803d', lw=1.2))
    ax.annotate('', xy=(3.35, 0.8), xytext=(2.1, 1.2), arrowprops=dict(arrowstyle='->', color='#7e22ce', lw=1.2))

    # Connect Processes to Processes and Data Stores
    ax.annotate('', xy=(4.0, 5.45), xytext=(4.0, 6.35), arrowprops=dict(arrowstyle='->', color='#475569', lw=1.2))
    ax.annotate('', xy=(6.15, 4.8), xytext=(4.65, 4.8), arrowprops=dict(arrowstyle='->', color='#475569', lw=1.2))
    ax.annotate('', xy=(8.5, 5.4), xytext=(4.65, 5.0), arrowprops=dict(arrowstyle='->', color='#475569', lw=1.2))
    ax.annotate('', xy=(8.5, 3.6), xytext=(7.45, 4.8), arrowprops=dict(arrowstyle='->', color='#475569', lw=1.2))
    ax.annotate('', xy=(6.8, 6.35), xytext=(6.8, 5.45), arrowprops=dict(arrowstyle='->', color='#475569', lw=1.2))
    ax.annotate('', xy=(8.5, 7.2), xytext=(4.65, 7.0), arrowprops=dict(arrowstyle='->', color='#475569', lw=1.2))
    ax.annotate('', xy=(6.15, 2.6), xytext=(4.65, 2.6), arrowprops=dict(arrowstyle='->', color='#475569', lw=1.2))
    ax.annotate('', xy=(8.5, 1.8), xytext=(7.45, 2.6), arrowprops=dict(arrowstyle='->', color='#475569', lw=1.2))
    ax.annotate('', xy=(6.15, 0.8), xytext=(4.65, 0.8), arrowprops=dict(arrowstyle='->', color='#475569', lw=1.2))

    # Connect YouTube / External
    ax.annotate('', xy=(10.9, 4.5), xytext=(7.45, 7.0), arrowprops=dict(arrowstyle='<->', color='#b45309', lw=1.2))

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, "data_flow_diagram.png"), dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved data_flow_diagram.png")

# 6. DATABASE ER DIAGRAM
def draw_database_er_diagram():
    fig, ax = plt.subplots(figsize=(14, 9), dpi=300)
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis('off')

    ax.text(7.0, 8.6, "INSIGHTLM: RELATIONAL & VECTOR DATABASE ENTITY-RELATIONSHIP (ER) MODEL", 
            ha='center', va='center', fontsize=14, fontweight='bold', color='#0f172a')
    ax.text(7.0, 8.25, "Entities, Primary/Foreign Keys, Cardinalities & Vector Embedding Links", 
            ha='center', va='center', fontsize=9.5, style='italic', color='#475569')

    entities = [
        {"name": "USERS", "x": 0.8, "y": 4.6, "w": 3.0, "h": 2.8, "color": "#1d4ed8",
         "attrs": ["PK  user_id (UUID)", "    username (VARCHAR)", "    email (VARCHAR, UNIQUE)", "    password_hash (SCRYPT)", "    role (ENUM: Student, ...)", "    institution (VARCHAR)", "    department (VARCHAR)", "    created_at (TIMESTAMP)"]},

        {"name": "DOCUMENTS", "x": 5.4, "y": 4.6, "w": 3.2, "h": 2.8, "color": "#059669",
         "attrs": ["PK  doc_id (UUID)", "FK  uploaded_by (USERS.user_id)", "    title (VARCHAR)", "    file_path (VARCHAR)", "    file_size_bytes (INT)", "    page_count (INT)", "    chunk_count (INT)", "    uploaded_at (TIMESTAMP)"]},

        {"name": "CHROMA_CHUNKS", "x": 10.0, "y": 4.6, "w": 3.2, "h": 2.8, "color": "#7c3aed",
         "attrs": ["PK  chunk_id (UUID)", "FK  doc_id (DOCUMENTS.doc_id)", "    chunk_index (INT)", "    page_number (INT)", "    text_content (TEXT)", "    embedding_vector (384-D)", "    token_length (INT)", "    hnsw_node_id (INT)"]},

        {"name": "QUESTION_PAPERS", "x": 0.8, "y": 0.8, "w": 3.0, "h": 2.8, "color": "#d97706",
         "attrs": ["PK  paper_id (UUID)", "FK  created_by (USERS.user_id)", "FK  doc_id (DOCUMENTS.doc_id)", "    title (VARCHAR)", "    total_marks (INT)", "    duration_mins (INT)", "    difficulty (ENUM)", "    created_at (TIMESTAMP)"]},

        {"name": "QUESTIONS_BANK", "x": 5.4, "y": 0.8, "w": 3.2, "h": 2.8, "color": "#db2777",
         "attrs": ["PK  question_id (UUID)", "FK  paper_id (QUESTION_PAPERS)", "    format_type (ENUM 8 Formats)", "    question_text (TEXT)", "    options_json (JSON)", "    correct_answer (TEXT)", "    marks (INT)", "    bloom_taxonomy (VARCHAR)"]},

        {"name": "SUBMISSIONS", "x": 10.0, "y": 0.8, "w": 3.2, "h": 2.8, "color": "#0d9488",
         "attrs": ["PK  submission_id (UUID)", "FK  paper_id (QUESTION_PAPERS)", "FK  student_id (USERS.user_id)", "    student_answers (JSON)", "    auto_score (FLOAT)", "    max_score (FLOAT)", "    status (ENUM: Evaluated)", "    submitted_at (TIMESTAMP)"]}
    ]

    for ent in entities:
        # Header Box
        hdr_rect = FancyBboxPatch((ent["x"], ent["y"] + ent["h"] - 0.5), ent["w"], 0.5,
                                  boxstyle="round,pad=0.02,rounding_size=0.08",
                                  facecolor=ent["color"], edgecolor=ent["color"], linewidth=1.2)
        ax.add_patch(hdr_rect)
        ax.text(ent["x"] + ent["w"]/2, ent["y"] + ent["h"] - 0.25, ent["name"],
                ha='center', va='center', fontsize=9, fontweight='bold', color='white')

        # Body Box
        body_rect = FancyBboxPatch((ent["x"], ent["y"]), ent["w"], ent["h"] - 0.5,
                                   boxstyle="round,pad=0.02,rounding_size=0.08",
                                   facecolor="#f8fafc", edgecolor=ent["color"], linewidth=1.2)
        ax.add_patch(body_rect)

        # Attribute text
        n_attrs = len(ent["attrs"])
        line_spacing = (ent["h"] - 0.6) / n_attrs
        for i, attr in enumerate(ent["attrs"]):
            ay = ent["y"] + ent["h"] - 0.75 - i * line_spacing
            is_pk = "PK" in attr
            is_fk = "FK" in attr
            txt_col = "#dc2626" if is_pk else ("#0284c7" if is_fk else "#1e293b")
            font_wt = "bold" if (is_pk or is_fk) else "normal"
            ax.text(ent["x"] + 0.15, ay, attr, fontsize=7.2, fontweight=font_wt, color=txt_col, fontfamily="monospace")

    # Cardinality Relationships (1:N)
    # 1. USERS (1) -> (N) DOCUMENTS
    ax.annotate('', xy=(5.4, 6.0), xytext=(3.8, 6.0),
                arrowprops=dict(arrowstyle='->', color='#1d4ed8', lw=1.5))
    ax.text(4.0, 6.15, "1", fontsize=8.5, fontweight='bold', color='#1d4ed8')
    ax.text(5.2, 6.15, "N (Uploads)", fontsize=7.5, fontweight='bold', color='#1d4ed8')

    # 2. DOCUMENTS (1) -> (N) CHROMA_CHUNKS
    ax.annotate('', xy=(10.0, 6.0), xytext=(8.6, 6.0),
                arrowprops=dict(arrowstyle='->', color='#059669', lw=1.5))
    ax.text(8.8, 6.15, "1", fontsize=8.5, fontweight='bold', color='#059669')
    ax.text(9.8, 6.15, "N (Chunks)", fontsize=7.5, fontweight='bold', color='#059669')

    # 3. USERS (1) -> (N) QUESTION_PAPERS
    ax.annotate('', xy=(2.3, 3.6), xytext=(2.3, 4.6),
                arrowprops=dict(arrowstyle='->', color='#d97706', lw=1.5))
    ax.text(2.4, 4.4, "1", fontsize=8.5, fontweight='bold', color='#d97706')
    ax.text(2.4, 3.8, "N (Authors)", fontsize=7.5, fontweight='bold', color='#d97706')

    # 4. QUESTION_PAPERS (1) -> (N) QUESTIONS_BANK
    ax.annotate('', xy=(5.4, 2.2), xytext=(3.8, 2.2),
                arrowprops=dict(arrowstyle='->', color='#db2777', lw=1.5))
    ax.text(4.0, 2.35, "1", fontsize=8.5, fontweight='bold', color='#db2777')
    ax.text(5.2, 2.35, "N (Items)", fontsize=7.5, fontweight='bold', color='#db2777')

    # 5. QUESTION_PAPERS (1) -> (N) SUBMISSIONS
    ax.annotate('', xy=(10.0, 2.2), xytext=(8.6, 2.2),
                arrowprops=dict(arrowstyle='->', color='#0d9488', lw=1.5))
    ax.text(8.8, 2.35, "1", fontsize=8.5, fontweight='bold', color='#0d9488')
    ax.text(9.8, 2.35, "N (Attempts)", fontsize=7.5, fontweight='bold', color='#0d9488')

    # 6. USERS (1) -> (N) SUBMISSIONS (Student)
    ax.annotate('', xy=(11.6, 3.6), xytext=(3.8, 5.0),
                arrowprops=dict(arrowstyle='->', color='#1d4ed8', lw=1.2, linestyle='dotted'))
    ax.text(7.5, 4.4, "1:N (Student Submits Exam)", fontsize=7.2, fontweight='bold', color='#1d4ed8')

    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, "database_er_diagram.png"), dpi=300, bbox_inches='tight')
    plt.close()
    print("Saved database_er_diagram.png")

if __name__ == "__main__":
    draw_system_architecture()
    draw_system_workflow()
    draw_use_case_diagram()
    draw_sequence_diagram()
    draw_data_flow_diagram()
    draw_database_er_diagram()
    print("ALL 6 DIAGRAMS GENERATED SUCCESSFULLY!")
