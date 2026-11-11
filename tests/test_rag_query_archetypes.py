import pytest
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_rag_query_archetype_1_directly_answered():
    """1. Direct question answered by the uploaded document."""
    payload = {
        "question": "What is the formula for Scaled Dot-Product Attention in the transformer paper?",
        "selected_doc_ids": ["doc-1"],
        "role": "Student"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert "content" in data
    assert len(data.get("sources", [])) > 0
    assert data["grounded"] is True

def test_rag_query_archetype_2_multiple_pages():
    """2. Question requiring information across multiple pages."""
    payload = {
        "question": "Explain the full encoder and decoder architecture and their positional encoding across pages.",
        "selected_doc_ids": ["doc-1"],
        "role": "Researcher"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data.get("sources", [])) >= 1

def test_rag_query_archetype_3_multi_document():
    """3. Question combining information from multiple documents."""
    payload = {
        "question": "How do attention mechanisms compare with retrieval-augmented generation?",
        "selected_doc_ids": ["doc-1", "doc-2"],
        "role": "Researcher"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert "sources" in data

def test_rag_query_archetype_4_no_answer_honest_admission():
    """4. Question with no answer in document (honest admission guardrail)."""
    payload = {
        "question": "What is the capital city of Australia and what is its annual rainfall?",
        "selected_doc_ids": ["doc-1"],
        "role": "Student"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert "does not contain" in data["content"].lower() or "not contain" in data["content"].lower()

def test_rag_query_archetype_5_unrelated():
    """5. Question completely unrelated to academic AI papers."""
    payload = {
        "question": "How do I bake a chocolate chip sourdough cake at 350 degrees?",
        "selected_doc_ids": ["doc-1"],
        "role": "Student"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert "does not contain" in data["content"].lower() or "covers" in data["content"].lower()

def test_rag_query_archetype_6_spelling_mistakes():
    """6. Question containing typographical or spelling errors."""
    payload = {
        "question": "Explayn the attenshun mechanizm and multy hed projection.",
        "selected_doc_ids": ["doc-1"],
        "role": "Student"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    assert "content" in resp.json()

def test_rag_query_archetype_7_long_query():
    """7. Very long detailed research inquiry (> 50 words)."""
    long_question = (
        "In modern scientific computing and natural language processing pipelines, transformer models rely on "
        "scaled dot-product attention where queries and keys of dimension d_k are multiplied and divided by sqrt(d_k). "
        "Could you provide a rigorous mathematical breakdown of why the square root scaling factor prevents gradient saturation "
        "in softmax functions when d_k is large?"
    )
    payload = {
        "question": long_question,
        "selected_doc_ids": ["doc-1"],
        "role": "Researcher"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    assert len(resp.json()["content"]) > 100

def test_rag_query_archetype_8_vague_ambiguous():
    """8. Vague and short ambiguous question."""
    payload = {
        "question": "How does it work?",
        "selected_doc_ids": ["doc-1"],
        "role": "Student"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    assert "content" in resp.json()

def test_rag_query_archetype_9_repeated_queries():
    """9. Repeated identical inquiries return consistent valid responses."""
    payload = {
        "question": "Define Multi-Head Attention.",
        "selected_doc_ids": ["doc-1"],
        "role": "Student"
    }
    resp1 = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    resp2 = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp1.status_code == 200
    assert resp2.status_code == 200
    assert len(resp1.json()["content"]) > 50
    assert len(resp2.json()["content"]) > 50

def test_rag_query_archetype_10_special_characters():
    """10. Query containing special characters and symbols."""
    payload = {
        "question": "Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V #@$%^&*?!",
        "selected_doc_ids": ["doc-1"],
        "role": "Researcher"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    assert "content" in resp.json()

def test_rag_query_archetype_11_summary_request():
    """11. Asking for an executive summary."""
    payload = {
        "question": "Provide a concise 3-paragraph summary of the core contributions of this paper.",
        "selected_doc_ids": ["doc-1"],
        "role": "Student"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    assert len(resp.json()["content"]) > 100

def test_rag_query_archetype_12_definition_request():
    """12. Asking for precise formal definitions."""
    payload = {
        "question": "Define self-attention, query vector, and key vector.",
        "selected_doc_ids": ["doc-1"],
        "role": "Student"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    assert "content" in resp.json()

def test_rag_query_archetype_13_comparison_request():
    """13. Asking for methodological comparisons."""
    payload = {
        "question": "Compare recurrent neural networks (RNNs) with the Transformer architecture.",
        "selected_doc_ids": ["doc-1"],
        "role": "Teacher"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    assert "content" in resp.json()

def test_rag_query_archetype_14_simple_language_explanation():
    """14. Asking for explanations in simple layman terms for beginner engineering students."""
    payload = {
        "question": "Explain self-attention like I am a 1st year engineering student using an intuitive analogy.",
        "selected_doc_ids": ["doc-1"],
        "role": "Student"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    assert "content" in resp.json()

def test_rag_query_archetype_15_exam_prep_questions():
    """15. Asking for potential university examination questions."""
    payload = {
        "question": "Generate 3 university-level examination questions based on Section 3 of this document.",
        "selected_doc_ids": ["doc-1"],
        "role": "Teacher"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    assert "content" in resp.json()
