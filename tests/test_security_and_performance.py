import pytest
import requests
import time
import os

BASE_URL = "http://127.0.0.1:8000"

def test_security_path_traversal_download_blocked():
    """Verify path traversal in document download is rejected."""
    # Attempt directory traversal attack
    traversal_ids = [
        "../../etc/passwd",
        "..%2F..%2Fetc%2Fpasswd",
        "..\\..\\windows\\win.ini",
        "....//....//server.py"
    ]
    for tid in traversal_ids:
        resp = requests.get(f"{BASE_URL}/api/documents/{tid}/download", timeout=5)
        # Should return 400 or 404, never 200 with sensitive system files
        assert resp.status_code in [400, 404]

def test_security_xss_injection_in_rag_query():
    """Verify XSS payloads in RAG queries are safely handled and do not trigger server-side errors."""
    xss_payloads = [
        "<script>alert('XSS')</script>",
        "<img src=x onerror=alert(1)>",
        "'; DROP TABLE documents; --",
        "{{7*7}}"
    ]
    for xss in xss_payloads:
        payload = {
            "question": f"Explain self-attention {xss}",
            "selected_doc_ids": ["doc-1"],
            "role": "Student"
        }
        resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
        assert resp.status_code == 200
        data = resp.json()
        assert "content" in data
        # Ensure server did not execute or crash
        assert isinstance(data["content"], str)

def test_security_api_keys_not_exposed_in_settings_or_health():
    """Verify raw API keys are never exposed in public health or settings endpoints."""
    # Health endpoint
    resp_health = requests.get(f"{BASE_URL}/api/health", timeout=5)
    assert resp_health.status_code == 200
    health_text = resp_health.text.lower()
    assert "gemini_api_key" not in health_text
    assert "openai_api_key" not in health_text
    assert "youtube_api_key" not in health_text
    
    # Settings endpoint
    resp_settings = requests.get(f"{BASE_URL}/api/settings", timeout=5)
    assert resp_settings.status_code == 200
    settings_data = resp_settings.json()
    assert "gemini_api_key" not in settings_data
    assert "openai_api_key" not in settings_data

def test_security_database_no_plaintext_passwords():
    """Verify backend/data/users.json never stores raw passwords."""
    users_path = os.path.join(os.path.dirname(__file__), "..", "backend", "data", "users.json")
    with open(users_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Raw passwords that must NEVER appear in the stored JSON
    raw_passwords = [
        "Aarav#Student2026",
        "Priya#Student2026",
        "Rahul#Teacher2026",
        "Sneha#Teacher2026",
        "Arjun#Research2026",
        "Ananya#Research2026"
    ]
    for pw in raw_passwords:
        assert pw not in content, f"Security violation: Found plaintext password '{pw}' in database!"

def test_performance_endpoint_latencies():
    """Measure exact wall-clock response latencies for core endpoints."""
    measurements = {}
    
    # 1. Health check latency
    t0 = time.perf_counter()
    resp = requests.get(f"{BASE_URL}/api/health", timeout=5)
    assert resp.status_code == 200
    measurements["health_latency_ms"] = round((time.perf_counter() - t0) * 1000, 2)
    
    # 2. Documents repository latency
    t0 = time.perf_counter()
    resp = requests.get(f"{BASE_URL}/api/documents", timeout=5)
    assert resp.status_code == 200
    measurements["documents_latency_ms"] = round((time.perf_counter() - t0) * 1000, 2)
    
    # 3. RAG Query latency
    t0 = time.perf_counter()
    payload = {"question": "What is self-attention?", "selected_doc_ids": ["doc-1"]}
    resp = requests.post(f"{BASE_URL}/api/rag/query", json=payload, timeout=5)
    assert resp.status_code == 200
    measurements["rag_latency_ms"] = round((time.perf_counter() - t0) * 1000, 2)
    
    # 4. Teacher question paper generation latency
    t0 = time.perf_counter()
    headers = {"X-User-Role": "Teacher"}
    payload = {"topic": "Transformers", "formats": ["mcq", "true_false"]}
    resp = requests.post(f"{BASE_URL}/api/teacher/questions/generate", json=payload, headers=headers, timeout=5)
    assert resp.status_code == 200
    measurements["question_gen_latency_ms"] = round((time.perf_counter() - t0) * 1000, 2)
    
    # 5. YouTube project recommendations latency
    t0 = time.perf_counter()
    resp = requests.get(f"{BASE_URL}/api/youtube/project-recommendations", timeout=5)
    assert resp.status_code == 200
    measurements["youtube_latency_ms"] = round((time.perf_counter() - t0) * 1000, 2)
    
    print("\n--- PERFORMANCE BENCHMARK RESULTS ---")
    for k, v in measurements.items():
        print(f"  {k}: {v} ms")
        # Ensure fast responses (< 1500 ms for local retrieval and generation)
        assert v < 1500, f"Latency too high for {k}: {v} ms"

def test_performance_burst_requests_reliability():
    """Verify server remains responsive under a burst of 10 sequential inquiries."""
    for i in range(10):
        resp = requests.get(f"{BASE_URL}/api/health", timeout=3)
        assert resp.status_code == 200
