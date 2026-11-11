# Insight-LM: A LangChain-Powered Document Research & Academic Assessment System

[![Python 3.11](https://img.shields.io/badge/Python-3.11-3776AB.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Flask 3.1](https://img.shields.io/badge/Flask-3.1-000000.svg?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-v0.5-orange.svg)](https://www.trychroma.com/)
[![Tests Passing](https://img.shields.io/badge/Automated%20Tests-71%2F71%20PASS-brightgreen.svg)](https://pytest.org/)

**Insight-LM** is an end-to-end, multi-modal academic intelligence platform designed for higher education students, university faculty, and scientific researchers. It combines hierarchical PDF document parsing, vector indexing with **ChromaDB**, grounded question answering using **Retrieval-Augmented Generation (RAG)**, role-based workflows, an 8-format teacher question paper studio, automated objective grading, and contextual YouTube lecture discovery.

---

## Architecture Overview

```
                               ┌────────────────────────────────────────────────────────┐
                               │     Insight-LM: Full-Stack Academic Architecture       │
                               └───────────────────────────┬────────────────────────────┘
                                                           │
                      ┌────────────────────────────────────┼────────────────────────────────────┐
                      ▼                                    ▼                                    ▼
       ┌─────────────────────────────┐      ┌─────────────────────────────┐      ┌─────────────────────────────┐
       │        Student Role         │      │        Teacher Role         │      │       Researcher Role       │
       │  (Aarav Sharma, Priya Patel)│      │(Rahul Verma, Sneha Iyer)    │      │ (Arjun Reddy, Ananya Nair)  │
       ├─────────────────────────────┤      ├─────────────────────────────┤      ├─────────────────────────────┤
       │ • Learning Dashboard        │      │ • Exam Studio (8 Formats)   │      │ • 10D Paper Matrix          │
       │ • Grounded Q&A Assistant    │      │ • Draft & Publish Papers    │      │ • Deep Literature Explorer  │
       │ • Timed Assessments         │      │ • Evaluation & Grading      │      │ • BibTeX / APA Citations    │
       │ • YouTube Video Lectures    │      │ • Class Roster Tracking     │      │ • Topic Modeling Insights   │
       └──────────────┬──────────────┘      └──────────────┬──────────────┘      └──────────────┬──────────────┘
                      │                                    │                                    │
                      └────────────────────────────────────┼────────────────────────────────────┘
                                                           │ (REST APIs + RBAC Headers)
                                                           ▼
                                            ┌─────────────────────────────┐
                                            │      Flask 3.1 Backend      │
                                            │ (server.py / port 8000)     │
                                            ├─────────────────────────────┤
                                            │ • Scrypt Password Hashing   │
                                            │ • Role Enforcement (RBAC)   │
                                            │ • PyPDF Hierarchical Chunker│
                                            │ • 8-Format Question Gen     │
                                            │ • Instant Auto-Grader       │
                                            └──────────────┬──────────────┘
                                                           │
                                ┌──────────────────────────┴──────────────────────────┐
                                ▼                                                     ▼
                 ┌─────────────────────────────┐                       ┌─────────────────────────────┐
                 │       Vector Database       │                       │     Academic Knowledge      │
                 │      (ChromaDB v0.5)        │                       │    (users.json / docs.json) │
                 ├─────────────────────────────┤                       ├─────────────────────────────┤
                 │ • Persistent SQLite3 & HNSW │                       │ • Salted Scrypt Hashes      │
                 │ • Text-embedding-004 space  │                       │ • Question Papers & Drafts  │
                 │ • Cosine similarity search  │                       │ • Student Test Submissions  │
                 └─────────────────────────────┘                       └─────────────────────────────┘
```

---

## Key Capabilities

1. **Grounded Document Research & Q&A (RAG)**:
   - Ingests complex multi-page academic PDFs with text cleaning and sliding-window chunking (512 tokens with 50-token overlap).
   - Generates vector embeddings stored in a persistent **ChromaDB** index.
   - Grounded context retrieval with source citations, similarity confidence scores, and exact page references.
   - Built-in **honest admission guardrail** detecting out-of-scope inquiries.

2. **Role-Based Access Control (RBAC)**:
   - Three distinct academic roles with strict permission gating on both frontend views and backend REST APIs.
   - Cross-role privilege escalation is strictly blocked (e.g., student accounts receive `HTTP 403 Forbidden` when attempting to access question paper authoring or publishing).

3. **Teacher Assessment Studio (8 Formats)**:
   - **Multiple Choice Questions (MCQ)** with 4 options and verified correct indices.
   - **True / False** assertions.
   - **Fill in the Blanks** (`___`) with expected answer keys.
   - **Short Answer** (2–4 marks) with model answers and evaluation points.
   - **Long Answer** (5–8 marks) with structured conceptual breakdown.
   - **Descriptive / Essay** (10–16 marks) with multi-criterion rubrics.
   - **Numerical / Quantitative** with given data, formula, and step-by-step calculations.
   - **Applied Case Study** with multi-part analytical questions.
   - Save drafts, configure total marks & exam duration, publish assignments to student rosters, and export to PDF/Print.

4. **Student Examination & Auto-Grading**:
   - Timed examination interface with live countdown timer, question jump palette, and review flagging.
   - Sanitized test view (answer keys stripped before delivery) to prevent inspect-element cheating.
   - Instant auto-grading for objective questions (MCQs, True/False, Blanks, Numerical).
   - Teacher grading studio for subjective questions and personalized feedback.

5. **Document-Matched YouTube Research**:
   - Extracts key concepts and matches relevant, high-quality video lectures.
   - Categorized project-based shelves for system architecture, tech stack deep dives, setup guides, and automated QA.

6. **Cryptographic Authentication**:
   - Passwords stored strictly as salted `scrypt:32768:8:1` hashes (`werkzeug.security`).
   - Interactive login portal with 1-click test credentials autofill, password visibility toggle, remember-me session flag, and self-service password reset.

---

## Pre-Configured Sample Indian Academic Accounts

| Persona | Role | Institution & Department | Username | Academic Email | Test Password |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Aarav Sharma** | `Student` | **IIT Delhi**<br>Dept. of Computer Science & Eng. | `aarav_student` | `aarav.sharma@research.edu.in` | `Aarav#Student2026` |
| **Priya Patel** | `Student` | **BITS Pilani**<br>School of Computing & AI | `priya_student` | `priya.patel@research.edu.in` | `Priya#Student2026` |
| **Prof. Rahul Verma** | `Teacher` | **IIT Bombay**<br>Dept. of Electrical Eng. & AI | `rahul_prof` | `rahul.verma@faculty.edu.in` | `Rahul#Teacher2026` |
| **Prof. Sneha Iyer** | `Teacher` | **IISc Bangalore**<br>Division of EECS | `sneha_prof` | `sneha.iyer@faculty.edu.in` | `Sneha#Teacher2026` |
| **Dr. Arjun Reddy** | `Researcher` | **IIT Madras**<br>Centre for Data Science & AI | `arjun_research` | `arjun.reddy@lab.edu.in` | `Arjun#Research2026` |
| **Dr. Ananya Nair** | `Researcher` | **IIIT Hyderabad**<br>Language Technologies Research | `ananya_research` | `ananya.nair@lab.edu.in` | `Ananya#Research2026` |

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Python 3.11, Flask 3.1, Werkzeug Security (`scrypt`), PyPDF 4.2
- **Vector Search & RAG**: ChromaDB v0.5 (Persistent SQLite3 + HNSW vector index), LangChain
- **External Search**: DuckDuckGo Search (`duckduckgo-search`)
- **Speech Synthesis**: Web Speech API Text-to-Speech
- **Testing**: Pytest 8.3, Requests, AnyIO

---

## Quick Start Guide

### Prerequisites
- **Node.js** >= 18.x
- **Python** >= 3.11

### 1. Clone the Repository
```bash
git clone https://github.com/venu9014/INSIGHT-LM-A-LANGCHAIN-POWERED-DOCUMENT-RESEARCH-SYSTEM.git
cd INSIGHT-LM-A-LANGCHAIN-POWERED-DOCUMENT-RESEARCH-SYSTEM
```

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start the Flask backend server
python backend/server.py
```
*The backend starts at `http://127.0.0.1:8000`.*

### 3. Frontend Setup
```bash
# Install npm packages
npm install

# Start the Vite development server
npm run dev
```
*The frontend opens at `http://localhost:5173`.*

### 4. Optional Environment Configuration
Copy `.env.example` to `.env` if you want to provide external LLM API keys (Google Gemini, OpenAI, or YouTube Data API v3):
```bash
cp .env.example .env
```
*(Note: The system functions completely out-of-the-box using the built-in ChromaDB index and verified educational catalogs even without external keys.)*

---

## Running Automated Tests

The repository includes a comprehensive 71-test automated QA test suite:

```bash
# Run all automated tests
python -m pytest tests/ -v
```

```text
============================= test session starts =============================
platform win32 -- Python 3.11.9, pytest-8.3.2
collected 71 items

tests/test_api_endpoints.py ....................                         [ 28%]
tests/test_auth_and_indian_accounts.py ..............                    [ 47%]
tests/test_e2e_workflow.py .                                             [ 49%]
tests/test_rag_query_archetypes.py ...............                       [ 70%]
tests/test_roles_and_assessments.py .......                              [ 80%]
tests/test_security_and_performance.py ......                           [ 88%]
tests/test_unit_and_rag.py ........                                      [100%]

======================= 71 passed, 1 warning in 14.84s ========================
```

---

## License

This project is licensed under the MIT License — see the LICENSE file for details.
