import os
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from report_common import add_p, add_table_custom

LOGO_PATH = r"C:\Users\cvenu\.gemini\antigravity\scratch\intelligent-research-assistant\INSIGHTLM_PHASE2_REPORT\mvjce_logo.png"

def build_frontmatter(doc):
    # -------------------------------------------------------------
    # 1. COVER PAGE
    # -------------------------------------------------------------
    p_vtu = doc.add_paragraph()
    p_vtu.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_vtu.paragraph_format.space_before = Pt(0)
    p_vtu.paragraph_format.space_after = Pt(2)
    r = p_vtu.add_run("VISVESVARAYA TECHNOLOGICAL UNIVERSITY\nBELAGAVI – 590018")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    # Logo
    if os.path.exists(LOGO_PATH):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(8)
        p_logo.paragraph_format.space_after = Pt(8)
        p_logo.add_run().add_picture(LOGO_PATH, width=Inches(1.8))

    p_proj = doc.add_paragraph()
    p_proj.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_proj.paragraph_format.space_before = Pt(4)
    p_proj.paragraph_format.space_after = Pt(4)
    r = p_proj.add_run("A PROJECT REPORT (PHASE-2) ON")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.bold = True

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(6)
    p_title.paragraph_format.space_after = Pt(12)
    r = p_title.add_run("INSIGHTLM: A LANGCHAIN-POWERED DOCUMENT RESEARCH SYSTEM")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(2)
    r = p_sub.add_run("Submitted in partial fulfillment of the requirements for the award of degree of\nBACHELOR OF ENGINEERING\nIN\nCOMPUTER SCIENCE & ENGINEERING (DATA SCIENCE)")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.italic = True

    p_by = doc.add_paragraph()
    p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_by.paragraph_format.space_before = Pt(12)
    p_by.paragraph_format.space_after = Pt(2)
    r = p_by.add_run("Submitted by:")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.bold = True

    # Student Names Table
    t_students = doc.add_table(rows=4, cols=2)
    t_students.alignment = WD_TABLE_ALIGNMENT.CENTER
    students_data = [
        ("DEEPAK S J", "1MJ24CD402"),
        ("M JAYANTH", "1MJ24CD404"),
        ("VARSHITHA H", "1MJ24CD411"),
        ("VENUGOPAL REDDY.C", "1MJ24CD412")
    ]
    for i, (name, usn) in enumerate(students_data):
        row = t_students.rows[i]
        p_l = row.cells[0].paragraphs[0]
        p_l.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p_l.paragraph_format.space_after = Pt(2)
        r = p_l.add_run(f"• {name}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10.5)
        r.bold = True

        p_r = row.cells[1].paragraphs[0]
        p_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p_r.paragraph_format.space_after = Pt(2)
        r = p_r.add_run(f"USN: {usn}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10.5)
        r.font.color.rgb = RGBColor(51, 65, 85)

    p_guide = doc.add_paragraph()
    p_guide.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_guide.paragraph_format.space_before = Pt(12)
    p_guide.paragraph_format.space_after = Pt(2)
    r = p_guide.add_run("Under the Guidance of\n")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.italic = True
    r2 = p_guide.add_run("Ms. Victoria Angelina\n")
    r2.font.name = 'Times New Roman'
    r2.font.size = Pt(11.5)
    r2.bold = True
    r3 = p_guide.add_run("Assistant Professor, Department of CSE (Data Science)")
    r3.font.name = 'Times New Roman'
    r3.font.size = Pt(10.5)

    p_dept = doc.add_paragraph()
    p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_before = Pt(14)
    p_dept.paragraph_format.space_after = Pt(0)
    r = p_dept.add_run("DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING (DATA SCIENCE)\nMVJ COLLEGE OF ENGINEERING\n(An Autonomous Institution, Affiliated to VTU, Belagavi, Approved by AICTE, New Delhi & Accredited by NBA & NAAC)\nNear ITPB, Channasandra, Kadugodi Post, Bengaluru – 560067\n2025–2026")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(10)
    r.bold = True
    r.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()

    # -------------------------------------------------------------
    # 2. CERTIFICATE PAGE
    # -------------------------------------------------------------
    if os.path.exists(LOGO_PATH):
        p_cert_logo = doc.add_paragraph()
        p_cert_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cert_logo.paragraph_format.space_before = Pt(0)
        p_cert_logo.paragraph_format.space_after = Pt(4)
        p_cert_logo.add_run().add_picture(LOGO_PATH, width=Inches(1.6))

    p_hdr = doc.add_paragraph()
    p_hdr.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_hdr.paragraph_format.space_before = Pt(0)
    p_hdr.paragraph_format.space_after = Pt(2)
    r = p_hdr.add_run("MVJ COLLEGE OF ENGINEERING\n")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(14)
    r.bold = True
    r2 = p_hdr.add_run("(An Autonomous Institution, Affiliated to VTU, Belagavi, Approved by AICTE, New Delhi)\nAccredited by NBA & NAAC, Near ITPB, Whitefield, Bengaluru – 560067\nDEPARTMENT OF COMPUTER SCIENCE & ENGINEERING (DATA SCIENCE)")
    r2.font.name = 'Times New Roman'
    r2.font.size = Pt(9.5)
    r2.bold = True

    p_cert_title = doc.add_paragraph()
    p_cert_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_title.paragraph_format.space_before = Pt(14)
    p_cert_title.paragraph_format.space_after = Pt(14)
    r = p_cert_title.add_run("CERTIFICATE")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.bold = True
    r.underline = True

    add_p(doc, 
        "This is to certify that the Phase-2 project work entitled \"INSIGHTLM: A LANGCHAIN-POWERED DOCUMENT RESEARCH SYSTEM\" is a bonafide work carried out by DEEPAK S J (1MJ24CD402), M JAYANTH (1MJ24CD404), VARSHITHA H (1MJ24CD411), and VENUGOPAL REDDY.C (1MJ24CD412) in partial fulfillment for the award of Bachelor of Engineering in Computer Science & Engineering (Data Science) of Visvesvaraya Technological University, Belagavi during the academic year 2025–2026. It is certified that all corrections/suggestions indicated for Internal Assessment have been incorporated in the report deposited in the departmental library. The project report has been approved as it satisfies the academic requirements in respect of Project Work prescribed for the said degree.",
        space_after=18)

    # Signatures Table
    t_sig = doc.add_table(rows=2, cols=3)
    t_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_headers = [
        ("............................................\nMs. Victoria Angelina\nProject Guide\nAssistant Professor, CSE (DS)", WD_ALIGN_PARAGRAPH.LEFT),
        ("............................................\nProf. B Sivasakthi\nHead of Department\nAssoc. Professor & HOD, CSE (DS)", WD_ALIGN_PARAGRAPH.CENTER),
        ("............................................\nDr. P. Mahabaleswarappa\nPrincipal\nMVJCE, Bengaluru", WD_ALIGN_PARAGRAPH.RIGHT)
    ]
    for c_idx, (text, align) in enumerate(sig_headers):
        cell = t_sig.rows[0].cells[c_idx]
        p = cell.paragraphs[0]
        p.alignment = align
        p.paragraph_format.space_before = Pt(24)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = 1.15
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(9.5)
        r.bold = True

    p_viva = doc.add_paragraph()
    p_viva.paragraph_format.space_before = Pt(24)
    p_viva.paragraph_format.space_after = Pt(6)
    r = p_viva.add_run("University Viva-Voce Examination:")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r.bold = True

    t_viva = doc.add_table(rows=3, cols=2)
    t_viva.alignment = WD_TABLE_ALIGNMENT.CENTER
    viva_rows = [
        ("Name of the Examiners", "Signature with Date"),
        ("1. ........................................................................................", "................................................................"),
        ("2. ........................................................................................", "................................................................")
    ]
    for r_idx, (c1, c2) in enumerate(viva_rows):
        row = t_viva.rows[r_idx]
        p1 = row.cells[0].paragraphs[0]
        p1.paragraph_format.space_after = Pt(4)
        r = p1.add_run(c1)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10)
        if r_idx == 0: r.bold = True

        p2 = row.cells[1].paragraphs[0]
        p2.paragraph_format.space_after = Pt(4)
        r = p2.add_run(c2)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10)
        if r_idx == 0: r.bold = True

    doc.add_page_break()

    # -------------------------------------------------------------
    # 3. DECLARATION PAGE
    # -------------------------------------------------------------
    p_decl = doc.add_paragraph()
    p_decl.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_decl.paragraph_format.space_before = Pt(12)
    p_decl.paragraph_format.space_after = Pt(16)
    r = p_decl.add_run("DECLARATION")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.bold = True
    r.underline = True

    add_p(doc,
        "We, the undersigned students of the Department of Computer Science & Engineering (Data Science), MVJ College of Engineering, Bengaluru, hereby declare that the project work entitled \"INSIGHTLM: A LANGCHAIN-POWERED DOCUMENT RESEARCH SYSTEM\" has been independently carried out by us under the supervision of Ms. Victoria Angelina, Assistant Professor, Department of Computer Science & Engineering (Data Science), MVJCE, in partial fulfillment of the requirements for the award of the degree of Bachelor of Engineering in Computer Science & Engineering (Data Science) from Visvesvaraya Technological University (VTU), Belagavi during the academic year 2025–2026.",
        space_after=12)

    add_p(doc,
        "We further declare that the matter embodied in this project report has not been submitted previously to any other university or institute for the award of any degree or diploma. All sources of literature, open-source libraries, academic papers, and frameworks referenced during the design, development, and testing of this software system have been duly cited and acknowledged in the bibliography.",
        space_after=24)

    t_decl = doc.add_table(rows=5, cols=3)
    t_decl.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_decl.rows[0].cells[0].paragraphs[0].add_run("Sl. No.").bold = True
    t_decl.rows[0].cells[1].paragraphs[0].add_run("Name of the Student & USN").bold = True
    t_decl.rows[0].cells[2].paragraphs[0].add_run("Signature").bold = True
    for c in t_decl.rows[0].cells:
        c.paragraphs[0].runs[0].font.name = 'Times New Roman'
        c.paragraphs[0].runs[0].font.size = Pt(10.5)

    students_decl = [
        ("1", "DEEPAK S J (1MJ24CD402)"),
        ("2", "M JAYANTH (1MJ24CD404)"),
        ("3", "VARSHITHA H (1MJ24CD411)"),
        ("4", "VENUGOPAL REDDY.C (1MJ24CD412)")
    ]
    for i, (sl, name_usn) in enumerate(students_decl):
        row = t_decl.rows[i + 1]
        p0 = row.cells[0].paragraphs[0]
        p0.paragraph_format.space_before = Pt(8)
        p0.paragraph_format.space_after = Pt(8)
        r0 = p0.add_run(sl)
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(10)

        p1 = row.cells[1].paragraphs[0]
        p1.paragraph_format.space_before = Pt(8)
        p1.paragraph_format.space_after = Pt(8)
        r1 = p1.add_run(name_usn)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(10)
        r1.bold = True

        p2 = row.cells[2].paragraphs[0]
        p2.paragraph_format.space_before = Pt(8)
        p2.paragraph_format.space_after = Pt(8)
        r2 = p2.add_run("....................................................")
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(10)

    p_dt = doc.add_paragraph()
    p_dt.paragraph_format.space_before = Pt(20)
    p_dt.paragraph_format.space_after = Pt(0)
    r = p_dt.add_run("Place: Bengaluru\nDate: May 2026")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(10.5)
    r.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_page_break()

    # -------------------------------------------------------------
    # 4. ACKNOWLEDGEMENT PAGE
    # -------------------------------------------------------------
    p_ack = doc.add_paragraph()
    p_ack.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ack.paragraph_format.space_before = Pt(12)
    p_ack.paragraph_format.space_after = Pt(16)
    r = p_ack.add_run("ACKNOWLEDGEMENT")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.bold = True
    r.underline = True

    add_p(doc,
        "The successful completion of this Phase-2 project dissertation entitled \"INSIGHTLM: A LANGCHAIN-POWERED DOCUMENT RESEARCH SYSTEM\" has been a deeply enriching academic experience. We take this opportunity to express our profound gratitude and heartfelt appreciation to all individuals and authorities who supported, guided, and encouraged us throughout this endeavor.",
        space_after=10)

    add_p(doc,
        "First and foremost, we express our profound gratitude to our esteemed Project Guide, Ms. Victoria Angelina, Assistant Professor, Department of Computer Science & Engineering (Data Science), for her invaluable mentorship, constructive criticisms, intellectual guidance, and continuous encouragement during every stage of design, system architecture, RAG optimization, and rigorous testing.",
        space_after=10)

    add_p(doc,
        "We extend our sincere and heartfelt thanks to Prof. B Sivasakthi, Associate Professor & Head, Department of Computer Science & Engineering (Data Science), for providing necessary computational resources, laboratory facilities, academic advice, and institutional support throughout the development of this capstone project.",
        space_after=10)

    add_p(doc,
        "We express our deep sense of gratitude to Dr. P. Mahabaleswarappa, Principal, MVJ College of Engineering, for fostering an academic environment dedicated to technical innovation, research excellence, and hands-on software development.",
        space_after=10)

    add_p(doc,
        "We also convey our appreciation to the Project Coordinators, faculty members, and non-teaching staff of the Department of Computer Science & Engineering (Data Science) for their continuous administrative assistance and valuable suggestions during periodic internal project reviews.",
        space_after=10)

    add_p(doc,
        "Finally, we express our deepest indebtedness to our parents and family members for their enduring moral support and sacrifices, and to our peers whose collaborative discussions and constructive feedback helped shape this research system into a production-grade academic reality.",
        space_after=20)

    p_sig_ack = doc.add_paragraph()
    p_sig_ack.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_sig_ack.paragraph_format.space_before = Pt(10)
    p_sig_ack.paragraph_format.space_after = Pt(0)
    r = p_sig_ack.add_run("DEEPAK S J (1MJ24CD402)\nM JAYANTH (1MJ24CD404)\nVARSHITHA H (1MJ24CD411)\nVENUGOPAL REDDY.C (1MJ24CD412)")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(10.5)
    r.bold = True

    doc.add_page_break()

    # -------------------------------------------------------------
    # 5. ABSTRACT PAGE
    # -------------------------------------------------------------
    p_abs = doc.add_paragraph()
    p_abs.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_abs.paragraph_format.space_before = Pt(12)
    p_abs.paragraph_format.space_after = Pt(16)
    r = p_abs.add_run("ABSTRACT")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.bold = True
    r.underline = True

    add_p(doc,
        "The contemporary academic and scientific landscape is characterized by an exponential influx of published literature, textbooks, and multi-modal digital resources. Researchers, university faculty, and undergraduate students confront severe cognitive overload, information fragmentation, and prohibitive search latencies when synthesizing insights across extensive document corpora. While Large Language Models (LLMs) offer fluent natural language interaction, standalone foundational models suffer from debilitating vulnerabilities including factual hallucinations, lack of verifiable source attribution, temporal knowledge cutoffs, and context window saturation. To decisively overcome these foundational limitations, this capstone project presents INSIGHTLM: A LangChain-Powered Document Research System, developed in Phase 2 as a production-grade, full-stack, retrieval-augmented intelligence and pedagogical assessment platform.",
        space_after=10)

    add_p(doc,
        "The system architecture employs a decoupled client-server paradigm. The frontend is engineered with React 18, TypeScript, Tailwind CSS, Lucide Vector Icons, and Vite, delivering an accessible, role-customized user experience across diverse academic workflows. The backend application server is built on Python 3.11 and Flask 3.1, incorporating a high-performance RESTful API gateway, CORS reverse-proxying, and cryptographic session management. Core document intelligence is driven by a LangChain Retrieval-Augmented Generation (RAG) orchestration pipeline. Ingested Portable Document Format (PDF) files undergo structural extraction via PyPDF, followed by semantic chunking through a RecursiveCharacterTextSplitter configured with a 1,000-character window and 200-character sliding overlap. Chunk representations are vectorized into 384-dimensional dense semantic embeddings using the all-MiniLM-L6-v2 transformer and indexed inside a persistent ChromaDB v0.5 vector database using Hierarchical Navigable Small World (HNSW) graph indexing with cosine similarity distance metric.",
        space_after=10)

    add_p(doc,
        "A cornerstone innovation of the Phase 2 implementation is the integration of an enterprise-grade Role-Based Access Control (RBAC) security model featuring salted Scrypt cryptographic password hashing. The system ships with six authentic Indian academic persona accounts across three specialized roles: Students (Aarav Sharma and Priya Patel), Teachers (Prof. Rahul Verma and Prof. Sneha Iyer), and Researchers (Dr. Arjun Reddy and Dr. Ananya Nair). Each persona accesses a dedicated, role-customized dashboard tailored to their respective workflow. For educators, INSIGHTLM introduces a pedagogical Question Paper Studio capable of deterministically generating examination questions across eight distinct formats: Multiple Choice Questions (MCQ), Fill in the Blanks, True/False, Short Answer, Numerical Problems, Assertion-Reason, Match the Following, and Long Essay questions, tagged according to Bloom's Revised Cognitive Taxonomy. Students interact with timed examination modules supported by an automated grading engine that computes instantaneous objective scores and detailed rubric feedback.",
        space_after=10)

    add_p(doc,
        "Furthermore, INSIGHTLM integrates cross-corpus multi-modal learning capabilities, including contextual YouTube lecture discovery via YouTube Data API v3, synthesized audio voiceover generation through the browser-native Web Speech API, 10-dimensional cross-paper comparative matrix generation, and a standardized scientific citation generator producing formatted references in IEEE, APA, MLA, and BibTeX standards. Comprehensive quality assurance testing executed against the live platform yielded a 100% pass rate across 71 automated test cases, confirming sub-500ms vector retrieval latencies, absolute cryptographic isolation, and zero plaintext credential leakage. INSIGHTLM establishes a reproducible, scalable benchmark for next-generation AI-assisted academic research and learning environments.",
        space_after=16)

    p_kw = doc.add_paragraph()
    p_kw.paragraph_format.space_before = Pt(6)
    p_kw.paragraph_format.space_after = Pt(0)
    r = p_kw.add_run("Keywords: ")
    r.bold = True
    r.font.name = 'Times New Roman'
    r.font.size = Pt(11)
    r2 = p_kw.add_run("Retrieval-Augmented Generation (RAG), LangChain, ChromaDB, HNSW Vector Indexing, Role-Based Access Control (RBAC), Scrypt Cryptography, Bloom's Taxonomy, Automated Assessment, Multi-Modal Learning, React TypeScript.")
    r2.italic = True
    r2.font.name = 'Times New Roman'
    r2.font.size = Pt(10.5)

    doc.add_page_break()

    # -------------------------------------------------------------
    # 6. TABLE OF CONTENTS
    # -------------------------------------------------------------
    p_toc = doc.add_paragraph()
    p_toc.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc.paragraph_format.space_before = Pt(12)
    p_toc.paragraph_format.space_after = Pt(16)
    r = p_toc.add_run("TABLE OF CONTENTS")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.bold = True
    r.underline = True

    toc_entries = [
        ("Certificate", "ii"),
        ("Declaration", "iii"),
        ("Acknowledgement", "iv"),
        ("Abstract", "v"),
        ("Table of Contents", "vii"),
        ("List of Figures", "ix"),
        ("List of Tables", "x"),
        ("List of Abbreviations", "xii"),
        ("CHAPTER 1: INTRODUCTION", "13"),
        ("    1.1 Background and Context", "13"),
        ("    1.2 Motivation", "14"),
        ("    1.3 Project Overview & Scope", "15"),
        ("    1.4 Objectives of Phase 2 Project", "16"),
        ("    1.5 Organization of the Report", "17"),
        ("CHAPTER 2: LITERATURE SURVEY", "19"),
        ("    2.1 Survey of Existing Document Analysis & RAG Systems", "19"),
        ("    2.2 Critical Analysis & Research Gaps", "21"),
        ("    2.3 Summary Table of Literature Survey", "22"),
        ("CHAPTER 3: PROBLEM STATEMENT & PROPOSED SYSTEM", "24"),
        ("    3.1 Problem Statement", "24"),
        ("    3.2 Limitations of the Existing System", "24"),
        ("    3.3 Proposed System Architecture & Innovations", "25"),
        ("    3.4 Key Features and Value Propositions", "26"),
        ("CHAPTER 4: REQUIREMENTS SPECIFICATION", "27"),
        ("    4.1 Functional Requirements", "27"),
        ("    4.2 Non-Functional Requirements", "28"),
        ("    4.3 Hardware Requirements", "29"),
        ("    4.4 Software Requirements", "30"),
        ("CHAPTER 5: SYSTEM DESIGN & ARCHITECTURE", "32"),
        ("    5.1 Overall Architectural Design (6-Layer Architecture)", "32"),
        ("    5.2 System Workflow Pipeline", "33"),
        ("    5.3 Role-Based Access Control (RBAC) & Use Case Modeling", "34"),
        ("    5.4 Sequence & Interaction Modeling", "35"),
        ("    5.5 Data Flow Modeling (Level 0 and Level 1 DFDs)", "36"),
        ("    5.6 Database & Vector Store Schema Design", "38"),
        ("CHAPTER 6: IMPLEMENTATION & METHODOLOGY", "41"),
        ("    6.1 Frontend Engineering (React 18 + TypeScript + Vite)", "41"),
        ("    6.2 Backend Services & REST API Gateway (Flask 3.1)", "42"),
        ("    6.3 Retrieval-Augmented Generation (RAG) Implementation", "43"),
        ("    6.4 Cryptographic Security & Indian Account Implementation", "44"),
        ("    6.5 Pedagogical Question Paper Studio (8 Formats)", "44"),
        ("    6.6 Automated Assessment & Instant Grading Engine", "45"),
        ("    6.7 Multi-Modal Research Integration (YouTube & Speech TTS)", "46"),
        ("    6.8 Scientific Citation Engine (IEEE, APA, MLA, BibTeX)", "46"),
        ("CHAPTER 7: RESULTS AND DISCUSSION", "47"),
        ("    7.1 User Interface Implementation & Verification", "47"),
        ("    7.2 Experimental Performance Evaluation", "58"),
        ("    7.3 Comparative Analysis with Baseline Systems", "59"),
        ("    7.4 Discussion on Findings and Usability", "60"),
        ("CHAPTER 8: SYSTEM TESTING AND VALIDATION", "61"),
        ("    8.1 QA Testing Methodology and Automation Framework", "61"),
        ("    8.2 Execution Results of the 71 Automated Test Cases", "61"),
        ("    8.3 Security & Role-Based Access Control Verification", "65"),
        ("    8.4 Cross-Browser and Stress Testing", "65"),
        ("CHAPTER 9: LIMITATIONS AND FUTURE ENHANCEMENTS", "66"),
        ("    9.1 Technical Limitations", "66"),
        ("    9.2 Future Enhancements", "66"),
        ("CHAPTER 10: CONCLUSION", "68"),
        ("    10.1 Concluding Remarks", "68"),
        ("    10.2 Summary of Contributions", "68"),
        ("REFERENCES", "70")
    ]

    t_toc = doc.add_table(rows=len(toc_entries), cols=2)
    t_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    for idx, (title, page) in enumerate(toc_entries):
        row = t_toc.rows[idx]
        p_l = row.cells[0].paragraphs[0]
        p_l.paragraph_format.space_after = Pt(2)
        p_l.paragraph_format.line_spacing = 1.15
        r_l = p_l.add_run(title)
        r_l.font.name = 'Times New Roman'
        r_l.font.size = Pt(10)
        if "CHAPTER" in title or "REFERENCES" in title or title in ["Certificate", "Declaration", "Acknowledgement", "Abstract"]:
            r_l.bold = True

        p_r = row.cells[1].paragraphs[0]
        p_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p_r.paragraph_format.space_after = Pt(2)
        p_r.paragraph_format.line_spacing = 1.15
        r_r = p_r.add_run(page)
        r_r.font.name = 'Times New Roman'
        r_r.font.size = Pt(10)
        if "CHAPTER" in title or "REFERENCES" in title:
            r_r.bold = True

    doc.add_page_break()

    # -------------------------------------------------------------
    # 7. LIST OF FIGURES
    # -------------------------------------------------------------
    p_lof = doc.add_paragraph()
    p_lof.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_lof.paragraph_format.space_before = Pt(12)
    p_lof.paragraph_format.space_after = Pt(16)
    r = p_lof.add_run("LIST OF FIGURES")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.bold = True
    r.underline = True

    figures_list = [
        ("Fig. 5.1", "6-Layer System Architecture of INSIGHTLM", "33"),
        ("Fig. 5.2", "End-to-End RAG Ingestion, Retrieval & Pedagogical Workflow", "34"),
        ("Fig. 5.3", "Role-Based Access Control (RBAC) Use Case Diagram", "35"),
        ("Fig. 5.4", "RAG Query, Vector Retrieval & Exam Submission Sequence Diagram", "36"),
        ("Fig. 5.5", "Level 0 and Level 1 Data Flow Diagram (DFD)", "37"),
        ("Fig. 5.6", "Relational & Vector Database Entity-Relationship (ER) Model", "38"),
        ("Fig. 7.1", "Academic Access Portal with Scrypt Authentication & Indian Personas", "48"),
        ("Fig. 7.2", "Student Learning Dashboard (Aarav Sharma)", "49"),
        ("Fig. 7.3", "Document Management Repository & Indexed Vector Corpus", "50"),
        ("Fig. 7.4", "Research Assistant with Grounded Q&A, Inline Citations & TTS Narration", "51"),
        ("Fig. 7.5", "Student Assessment Studio & Timed Examination Interface", "52"),
        ("Fig. 7.6", "YouTube Video Discovery & Topic-Specific Project Shelves", "53"),
        ("Fig. 7.7", "Teacher Teaching Dashboard & Curriculum Metrics (Prof. Rahul Verma)", "54"),
        ("Fig. 7.8", "Teacher Question Paper Studio with 8 Assessment Formats", "55"),
        ("Fig. 7.9", "Student Exam Submission & Instant Auto-Grading Evaluation", "56"),
        ("Fig. 7.10", "Researcher Academic Workspace & Analytics (Dr. Arjun Reddy)", "57"),
        ("Fig. 7.11", "10-Dimensional Cross-Document Comparison Matrix", "57"),
        ("Fig. 7.12", "Standardized Citation Generator (IEEE, APA, MLA, BibTeX)", "58")
    ]

    t_lof = doc.add_table(rows=len(figures_list) + 1, cols=3)
    t_lof.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_lof.rows[0].cells[0].paragraphs[0].add_run("Figure No.").bold = True
    t_lof.rows[0].cells[1].paragraphs[0].add_run("Figure Caption Title").bold = True
    t_lof.rows[0].cells[2].paragraphs[0].add_run("Page No.").bold = True

    for idx, (fno, ftitle, fpage) in enumerate(figures_list):
        row = t_lof.rows[idx + 1]
        p0 = row.cells[0].paragraphs[0]
        p0.paragraph_format.space_after = Pt(3)
        r0 = p0.add_run(fno)
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(9.5)
        r0.bold = True

        p1 = row.cells[1].paragraphs[0]
        p1.paragraph_format.space_after = Pt(3)
        r1 = p1.add_run(ftitle)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(9.5)

        p2 = row.cells[2].paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p2.paragraph_format.space_after = Pt(3)
        r2 = p2.add_run(fpage)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(9.5)

    doc.add_page_break()

    # -------------------------------------------------------------
    # 8. LIST OF TABLES
    # -------------------------------------------------------------
    p_lot = doc.add_paragraph()
    p_lot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_lot.paragraph_format.space_before = Pt(12)
    p_lot.paragraph_format.space_after = Pt(16)
    r = p_lot.add_run("LIST OF TABLES")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.bold = True
    r.underline = True

    tables_list = [
        ("Table 2.1", "Comparative Summary of Literature Survey Papers", "22"),
        ("Table 4.1", "Functional Requirements Specification (FR-01 to FR-12)", "27"),
        ("Table 4.2", "Non-Functional Requirements Specification (NFR-01 to NFR-08)", "28"),
        ("Table 4.3", "Hardware & Computational Environment Specifications", "29"),
        ("Table 4.4", "Software Stack & Technical Dependency Specifications", "30"),
        ("Table 5.1", "USERS Relational Schema and Cryptographic Attributes", "38"),
        ("Table 5.2", "DOCUMENTS Relational Schema and Metadata Attributes", "39"),
        ("Table 5.3", "QUESTION_PAPERS & SUBMISSIONS Relational Schema", "39"),
        ("Table 5.4", "CHROMA_CHUNKS High-Dimensional Vector Schema", "40"),
        ("Table 6.1", "Supported 8 Question Formats Mapped to Bloom's Cognitive Levels", "44"),
        ("Table 7.1", "System Latency & Vector Retrieval Benchmark Results", "58"),
        ("Table 7.2", "Comparative Benchmark: INSIGHTLM vs. Alternative Architectures", "59"),
        ("Table 8.1", "Test Suite 1: Authentication & Indian Persona Accounts (14 Tests)", "61"),
        ("Table 8.2", "Test Suite 2: Roles, Assessments & Question Studio (7 Tests)", "62"),
        ("Table 8.3", "Test Suite 3: RAG Query Archetypes & Accuracy Validation (16 Tests)", "62"),
        ("Table 8.4", "Test Suite 4: Security, RBAC & Performance Benchmarks (6 Tests)", "63"),
        ("Table 8.8", "Overall QA Automated Testing Suite Execution Metrics", "64")
    ]

    t_lot = doc.add_table(rows=len(tables_list) + 1, cols=3)
    t_lot.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_lot.rows[0].cells[0].paragraphs[0].add_run("Table No.").bold = True
    t_lot.rows[0].cells[1].paragraphs[0].add_run("Table Title Description").bold = True
    t_lot.rows[0].cells[2].paragraphs[0].add_run("Page No.").bold = True

    for idx, (tno, ttitle, tpage) in enumerate(tables_list):
        row = t_lot.rows[idx + 1]
        p0 = row.cells[0].paragraphs[0]
        p0.paragraph_format.space_after = Pt(3)
        r0 = p0.add_run(tno)
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(9.5)
        r0.bold = True

        p1 = row.cells[1].paragraphs[0]
        p1.paragraph_format.space_after = Pt(3)
        r1 = p1.add_run(ttitle)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(9.5)

        p2 = row.cells[2].paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p2.paragraph_format.space_after = Pt(3)
        r2 = p2.add_run(tpage)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(9.5)

    doc.add_page_break()

    # -------------------------------------------------------------
    # 9. LIST OF ABBREVIATIONS
    # -------------------------------------------------------------
    p_abbr = doc.add_paragraph()
    p_abbr.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_abbr.paragraph_format.space_before = Pt(12)
    p_abbr.paragraph_format.space_after = Pt(16)
    r = p_abbr.add_run("LIST OF ABBREVIATIONS")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.bold = True
    r.underline = True

    abbr_list = [
        ("AI", "Artificial Intelligence"),
        ("API", "Application Programming Interface"),
        ("CORS", "Cross-Origin Resource Sharing"),
        ("CRUD", "Create, Read, Update, Delete"),
        ("CSE", "Computer Science & Engineering"),
        ("DFD", "Data Flow Diagram"),
        ("DPR", "Dense Passage Retrieval"),
        ("ERD", "Entity-Relationship Diagram"),
        ("HNSW", "Hierarchical Navigable Small World (Graph Index)"),
        ("HTTP", "Hypertext Transfer Protocol"),
        ("IEEE", "Institute of Electrical and Electronics Engineers"),
        ("JSON", "JavaScript Object Notation"),
        ("LLM", "Large Language Model"),
        ("MCQ", "Multiple Choice Question"),
        ("MVJCE", "MVJ College of Engineering"),
        ("NFR", "Non-Functional Requirement"),
        ("NLP", "Natural Language Processing"),
        ("PDF", "Portable Document Format"),
        ("RAG", "Retrieval-Augmented Generation"),
        ("RBAC", "Role-Based Access Control"),
        ("REST", "Representational State Transfer"),
        ("SBERT", "Sentence-BERT (Bidirectional Encoder Representations from Transformers)"),
        ("Scrypt", "Memory-Hard Cryptographic Key Derivation Function"),
        ("TF-IDF", "Term Frequency - Inverse Document Frequency"),
        ("TS", "TypeScript"),
        ("TTS", "Text-to-Speech"),
        ("UI/UX", "User Interface / User Experience"),
        ("USN", "University Seat Number"),
        ("VTU", "Visvesvaraya Technological University"),
        ("WSGI", "Web Server Gateway Interface")
    ]

    t_abbr = doc.add_table(rows=len(abbr_list) + 1, cols=2)
    t_abbr.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_abbr.rows[0].cells[0].paragraphs[0].add_run("Abbreviation").bold = True
    t_abbr.rows[0].cells[1].paragraphs[0].add_run("Expansion / Full Term").bold = True

    for idx, (abbr, exp) in enumerate(abbr_list):
        row = t_abbr.rows[idx + 1]
        p0 = row.cells[0].paragraphs[0]
        p0.paragraph_format.space_after = Pt(2.5)
        r0 = p0.add_run(abbr)
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(9.5)
        r0.bold = True

        p1 = row.cells[1].paragraphs[0]
        p1.paragraph_format.space_after = Pt(2.5)
        r1 = p1.add_run(exp)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(9.5)

    doc.add_page_break()
    print("Frontmatter sections built successfully.")
