import pytest
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_rbac_unauthorized_student_access_to_teacher_endpoints():
    # A student attempting to create or publish a question paper must receive 403 Forbidden
    headers = {"X-User-Role": "Student", "Content-Type": "application/json"}
    
    # 1. Generate questions
    resp = requests.post(f"{BASE_URL}/api/teacher/questions/generate", json={"topic": "Transformers"}, headers=headers, timeout=5)
    assert resp.status_code == 403
    assert resp.json()["code"] == "FORBIDDEN"
    
    # 2. Get question papers
    resp = requests.get(f"{BASE_URL}/api/teacher/question-papers", headers=headers, timeout=5)
    assert resp.status_code == 403
    
    # 3. Publish paper
    resp = requests.post(f"{BASE_URL}/api/teacher/question-papers/paper-model-1/publish", headers=headers, timeout=5)
    assert resp.status_code == 403

def test_teacher_generate_questions_all_8_formats():
    headers = {"X-User-Role": "Teacher", "Content-Type": "application/json"}
    payload = {
        "topic": "Multi-Head Attention and ChromaDB RAG",
        "subject": "Deep Learning",
        "grade_level": "Undergraduate",
        "difficulty": "Hard",
        "formats": [
            "mcq", "true_false", "fill_blank", "short_answer",
            "long_answer", "descriptive", "numerical", "case_study"
        ]
    }
    resp = requests.post(f"{BASE_URL}/api/teacher/questions/generate", json=payload, headers=headers, timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    questions = data["questions"]
    assert len(questions) == 8
    
    # Verify each of the 8 formats
    formats_found = {q["format"] for q in questions}
    expected_formats = {
        "mcq", "true_false", "fill_blank", "short_answer",
        "long_answer", "descriptive", "numerical", "case_study"
    }
    assert formats_found == expected_formats
    
    # Format-specific validations:
    mcq = next(q for q in questions if q["format"] == "mcq")
    assert len(mcq["options"]) == 4
    assert mcq["correctIndex"] in [0, 1, 2, 3]
    assert "marks" in mcq
    
    tf = next(q for q in questions if q["format"] == "true_false")
    assert tf["options"] == ["True", "False"]
    
    fb = next(q for q in questions if q["format"] == "fill_blank")
    assert "___" in fb["question"]
    assert "correctAnswer" in fb
    
    sa = next(q for q in questions if q["format"] == "short_answer")
    assert len(sa["keyPoints"]) >= 2
    assert "modelAnswer" in sa
    
    la = next(q for q in questions if q["format"] == "long_answer")
    assert len(la["keyPoints"]) >= 3
    assert la["marks"] >= 5
    
    desc = next(q for q in questions if q["format"] == "descriptive")
    assert len(desc["rubric"]) >= 3
    assert desc["marks"] >= 10
    
    num = next(q for q in questions if q["format"] == "numerical")
    assert "givenData" in num
    assert "formula" in num
    assert "correctNumericalValue" in num
    assert "unit" in num
    
    cs = next(q for q in questions if q["format"] == "case_study")
    assert "scenario" in cs
    assert len(cs["subQuestions"]) >= 2

def test_teacher_question_paper_crud_and_publish():
    headers = {"X-User-Role": "Teacher", "Content-Type": "application/json"}
    
    # 1. Create a draft paper
    draft_paper = {
        "title": "Automated Unit Test Model Exam",
        "subject": "CS-901 Artificial Intelligence",
        "course": "Representation Learning",
        "gradeLevel": "Graduate",
        "examType": "Midterm Examination",
        "durationMinutes": 90,
        "instructions": ["Answer all questions."],
        "sections": ["Section 1"],
        "questions": [
            {
                "id": "test-q1",
                "format": "mcq",
                "question": "Which layer replaces recurrence?",
                "options": ["Self-Attention", "Convolution", "Dense", "Pooling"],
                "correctIndex": 0,
                "marks": 5,
                "explanation": "Self-attention enables parallel computation."
            },
            {
                "id": "test-q2",
                "format": "fill_blank",
                "question": "ChromaDB stores high-dimensional ___ vectors.",
                "correctAnswer": "embedding",
                "acceptedAnswers": ["embedding", "embeddings"],
                "marks": 5,
                "explanation": "Dense embeddings represent semantic vectors."
            }
        ]
    }
    
    resp = requests.post(f"{BASE_URL}/api/teacher/question-papers", json=draft_paper, headers=headers, timeout=5)
    assert resp.status_code == 200
    created = resp.json()["question_paper"]
    created_id = created["id"]
    assert created["status"] == "draft"
    assert created["totalMarks"] == 10
    
    # 2. Get papers list
    resp = requests.get(f"{BASE_URL}/api/teacher/question-papers", headers=headers, timeout=5)
    assert resp.status_code == 200
    papers = resp.json()["question_papers"]
    assert any(p["id"] == created_id for p in papers)
    
    # 3. Publish paper
    resp = requests.post(f"{BASE_URL}/api/teacher/question-papers/{created_id}/publish", headers=headers, timeout=5)
    assert resp.status_code == 200
    pub_data = resp.json()
    assert pub_data["success"] is True
    assert pub_data["paper"]["status"] == "published"
    assert "assignment" in pub_data

def test_student_assessments_retrieval_and_sanitization():
    # Student retrieves active assessments
    headers = {"X-User-Role": "Student"}
    resp = requests.get(f"{BASE_URL}/api/student/assessments", headers=headers, timeout=5)
    assert resp.status_code == 200
    assessments = resp.json()["assessments"]
    assert isinstance(assessments, list)
    assert len(assessments) >= 1
    
    # Student retrieves paper detail for taking test
    paper_id = assessments[0]["paperId"]
    resp = requests.get(f"{BASE_URL}/api/student/assessments/{paper_id}", headers=headers, timeout=5)
    assert resp.status_code == 200
    paper = resp.json()["assessment"]
    assert "questions" in paper
    
    # Verify strict sanitization: no answer keys revealed to student!
    for q in paper["questions"]:
        assert "correctIndex" not in q
        assert "correctAnswer" not in q
        assert "acceptedAnswers" not in q
        assert "modelAnswer" not in q
        assert "rubric" not in q
        assert "stepByStepSolution" not in q
        assert "explanation" not in q
        assert "correctNumericalValue" not in q

def _submit_test_as_student():
    headers = {"X-User-Role": "Student", "Content-Type": "application/json"}
    submission_payload = {
        "studentId": "student-test-01",
        "studentName": "Jordan Miller",
        "timeSpentSeconds": 1820,
        "answers": {
            "q-mcq-1": 1,         # Correct answer (2 marks)
            "q-tf-1": 0,          # Correct answer (2 marks)
            "q-fb-1": "vector",   # Correct answer (2 marks)
            "q-num-1": 1048576,   # Correct answer (6 marks)
            "q-sa-1": "Hallucination is generating false assertions. RAG grounds responses in verified vector passages.",
            "q-la-1": "Multi-Head Attention linearly projects queries, keys, and values into multiple subspaces in parallel.",
            "q-desc-1": "Full end-to-end architecture with PyPDF ingestion, ChromaDB HNSW indexing, and role-adaptive prompt synthesis.",
            "q-cs-1-sub1": "Parametric failure mode resolved by dense retrieval grounding."
        }
    }
    
    resp = requests.post(f"{BASE_URL}/api/student/assessments/paper-model-1/submit", json=submission_payload, headers=headers, timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    sub = data["submission"]
    assert sub["studentId"] == "student-test-01"
    
    # Auto-graded objective score: MCQ (2) + TF (2) + FB (2) + NUM (6) = 12 marks
    assert sub["autoGradedScore"] == 12
    assert sub["maxObjectiveMarks"] == 12
    assert sub["status"] == "pending_teacher_review"
    
    # Revealed question results for objective questions
    q_results = sub["questionResults"]
    assert q_results["q-mcq-1"]["isCorrect"] is True
    assert q_results["q-mcq-1"]["awardedMarks"] == 2
    assert q_results["q-tf-1"]["isCorrect"] is True
    assert q_results["q-fb-1"]["isCorrect"] is True
    assert q_results["q-num-1"]["isCorrect"] is True
    return sub["id"]

def test_student_test_submission_and_auto_grading():
    sub_id = _submit_test_as_student()
    assert sub_id.startswith("sub-")

def test_teacher_grade_student_submission():
    # First submit as student
    submission_id = _submit_test_as_student()
    
    # Now teacher evaluates subjective questions
    headers = {"X-User-Role": "Teacher", "Content-Type": "application/json"}
    
    # Get submissions list
    resp = requests.get(f"{BASE_URL}/api/teacher/submissions", headers=headers, timeout=5)
    assert resp.status_code == 200
    subs = resp.json()["submissions"]
    assert any(s["id"] == submission_id for s in subs)
    
    # Grade subjective questions
    grade_payload = {
        "grades": {
            "q-sa-1": 4,      # full marks
            "q-la-1": 7,      # 7 out of 8
            "q-desc-1": 15,   # 15 out of 16
            "q-cs-1": 9       # 9 out of 10
        },
        "feedback": "Outstanding technical depth and clear formulation.",
        "teacherName": "Prof. Elena Rostova"
    }
    
    resp = requests.post(f"{BASE_URL}/api/teacher/submissions/{submission_id}/grade", json=grade_payload, headers=headers, timeout=5)
    assert resp.status_code == 200
    graded_sub = resp.json()["submission"]
    assert graded_sub["status"] == "final_graded"
    assert graded_sub["manualGradedScore"] == 4 + 7 + 15 + 9 # 35
    assert graded_sub["totalScore"] == 12 + 35 # 47
    assert graded_sub["percentage"] == round((47 / 50) * 100, 1) # 94.0%
    assert graded_sub["teacherFeedback"] == "Outstanding technical depth and clear formulation."

def test_project_youtube_recommendations():
    resp = requests.get(f"{BASE_URL}/api/youtube/project-recommendations?query=Full-Stack+RAG+Assistant", timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert "project_title" in data
    assert "tech_stack" in data
    assert "categories" in data
    assert len(data["categories"]) >= 6
    
    for cat in data["categories"]:
        assert "id" in cat
        assert "title" in cat
        assert "description" in cat
        assert "videos" in cat
        assert len(cat["videos"]) >= 1
        for v in cat["videos"]:
            assert "videoId" in v
            assert "url" in v
            assert "https://www.youtube.com/watch?v=" in v["url"]
            assert "thumbnailUrl" in v
            assert "duration" in v
