import pytest
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_health_endpoint():
    resp = requests.get(f"{BASE_URL}/api/health", timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "online"
    assert "chromadb_active" in data
    assert data["indexed_documents_count"] >= 1
    assert data["total_chunks_indexed"] >= 1

def test_get_documents():
    resp = requests.get(f"{BASE_URL}/api/documents", timeout=5)
    assert resp.status_code == 200
    docs = resp.json()
    assert isinstance(docs, list)
    assert len(docs) > 0
    doc = docs[0]
    assert "id" in doc
    assert "name" in doc
    assert "pages" in doc
    assert "chunksCount" in doc
    assert "abstract" in doc
    assert "tags" in doc

def test_upload_validation_no_file():
    resp = requests.post(f"{BASE_URL}/api/documents/upload", files={}, timeout=5)
    assert resp.status_code == 400
    assert "error" in resp.json()

def test_upload_validation_unsupported_format():
    files = {"file": ("malicious.exe", b"fake binary content", "application/octet-stream")}
    resp = requests.post(f"{BASE_URL}/api/documents/upload", files=files, timeout=5)
    assert resp.status_code == 400
    assert "Unsupported format" in resp.json()["error"]

def test_upload_validation_empty_file():
    files = {"file": ("empty.pdf", b"", "application/pdf")}
    resp = requests.post(f"{BASE_URL}/api/documents/upload", files=files, timeout=5)
    assert resp.status_code == 400
    assert "empty" in resp.json()["error"].lower()

def test_upload_validation_unreadable_or_short():
    files = {"file": ("short.txt", b"Too short", "text/plain")}
    resp = requests.post(f"{BASE_URL}/api/documents/upload", files=files, timeout=5)
    assert resp.status_code == 422
    assert "readable text" in resp.json()["error"].lower()

def test_upload_duplicate_detection():
    # Attempting to upload a document that already exists in corpus
    files = {"file": ("Transformer_Architecture.pdf", b"Some random content", "application/pdf")}
    resp = requests.post(f"{BASE_URL}/api/documents/upload", files=files, timeout=5)
    assert resp.status_code == 400
    assert "Duplicate detected" in resp.json()["error"]

def test_rag_query_empty_question():
    payload = {"question": "", "selected_doc_ids": ["doc-1"]}
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 400
    assert "cannot be empty" in resp.json()["error"]

def test_rag_query_grounded_answer():
    payload = {
        "question": "How does Scaled Dot-Product Attention compute scores in Transformer_Architecture.pdf?",
        "selected_doc_ids": ["doc-1"],
        "role": "Student"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=10)
    assert resp.status_code == 200
    data = resp.json()
    assert data["grounded"] is True
    assert "content" in data
    assert "Page" in data["content"]
    assert len(data["sources"]) > 0
    assert data["sources"][0]["page"] in [1, 3, 7]
    assert len(data["recommendedVideos"]) > 0
    assert data["recommendedVideos"][0]["thumbnailUrl"].startswith("http")

def test_rag_query_honest_admission_out_of_scope():
    payload = {
        "question": "What is the historical price of fresh apples in Victorian England in 1860?",
        "selected_doc_ids": ["doc-1"],
        "role": "Researcher"
    }
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=10)
    assert resp.status_code == 200
    data = resp.json()
    assert "does not contain information directly addressing" in data["content"]
    assert data["grounded"] is True

def test_summarize_endpoint():
    payload = {
        "doc_id": "doc-1",
        "summary_type": "Detailed Research Summary",
        "length": "Medium",
        "audience": "Intermediate"
    }
    resp = requests.post(f"{BASE_URL}/api/summarize", json=payload, timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert data["documentId"] == "doc-1"
    assert "abstract" in data
    assert "problemStatement" in data
    assert "methodology" in data
    assert "dataset" in data
    assert "results" in data
    assert "advantages" in data
    assert "limitations" in data
    assert "conclusion" in data

def test_summarize_missing_doc_id():
    resp = requests.post(f"{BASE_URL}/api/summarize", json={}, timeout=5)
    assert resp.status_code == 400
    assert "Document ID is required" in resp.json()["error"]

def test_summarize_nonexistent_doc():
    resp = requests.post(f"{BASE_URL}/api/summarize", json={"doc_id": "nonexistent-doc-999"}, timeout=5)
    assert resp.status_code == 404
    assert "not found" in resp.json()["error"]

def test_compare_endpoint():
    payload = {"doc_ids": ["doc-1", "doc-2"]}
    resp = requests.post(f"{BASE_URL}/api/compare", json=payload, timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert "comparisonMatrix" in data
    assert len(data["comparisonMatrix"]) >= 8
    assert "insights" in data
    assert "commonApproaches" in data["insights"]
    assert "majorDifferences" in data["insights"]
    assert "strengths" in data["insights"]
    assert "weaknesses" in data["insights"]

def test_compare_insufficient_docs():
    resp = requests.post(f"{BASE_URL}/api/compare", json={"doc_ids": ["doc-1"]}, timeout=5)
    assert resp.status_code == 400
    assert "at least 2 documents" in resp.json()["error"]

def test_compare_excessive_docs():
    resp = requests.post(f"{BASE_URL}/api/compare", json={"doc_ids": ["d1", "d2", "d3", "d4", "d5", "d6"]}, timeout=5)
    assert resp.status_code == 400
    assert "maximum of 5 documents" in resp.json()["error"]

def test_youtube_discovery_endpoint():
    resp = requests.get(f"{BASE_URL}/api/youtube/discover?doc_id=doc-1", timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert "topic" in data
    assert "keywords" in data
    assert "videos" in data
    assert len(data["videos"]) > 0
    vid = data["videos"][0]
    assert "title" in vid
    assert "channel" in vid
    assert "duration" in vid
    assert "thumbnailUrl" in vid
    assert "url" in vid
    assert "manual_fallback_url" in data
    assert data["manual_fallback_url"].startswith("https://www.youtube.com")

def test_explorer_search_endpoint():
    resp = requests.get(f"{BASE_URL}/api/explorer/search?topic=Transformer+Attention", timeout=5)
    assert resp.status_code == 200
    data = resp.json()
    assert data["topic"] == "Transformer Attention"
    assert "overview" in data
    assert "keyConcepts" in data
    assert "importantFindings" in data
    assert "sources" in data
    assert len(data["sources"]) > 0

def test_settings_endpoint():
    # Read settings
    get_resp = requests.get(f"{BASE_URL}/api/settings", timeout=5)
    assert get_resp.status_code == 200
    settings = get_resp.json()
    assert "chunk_size" in settings
    
    # Update settings
    post_resp = requests.post(f"{BASE_URL}/api/settings", json={"chunk_size": 512, "temperature": 0.25}, timeout=5)
    assert post_resp.status_code == 200
    assert post_resp.json()["settings"]["temperature"] == 0.25

def test_document_download():
    resp = requests.get(f"{BASE_URL}/api/documents/doc-1/download", timeout=5)
    assert resp.status_code == 200
    assert len(resp.content) > 100
