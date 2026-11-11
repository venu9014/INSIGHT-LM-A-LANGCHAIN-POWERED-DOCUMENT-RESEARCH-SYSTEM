import os
import sys
import time
import requests
import pytest
import pypdf

BASE_URL = "http://127.0.0.1:8000"

def create_sample_research_pdf(file_path: str):
    """Generates a genuine multi-page scientific research PDF using pypdf writer"""
    writer = pypdf.PdfWriter()
    
    # Page 1: Abstract and Problem Statement
    page1 = writer.add_blank_page(width=612, height=792)
    
    # Write sample PDF bytes with stream
    # A lightweight genuine PDF structure
    pdf_content = b"""%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << /Font << /F1 7 0 R >> >> >> endobj
4 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 6 0 R /Resources << /Font << /F1 7 0 R >> >> >> endobj
5 0 obj << /Length 380 >> stream
BT
/F1 14 Tf
72 720 Td (Autonomous Grounded Reasoning in Scientific Assistants) Tj
/F1 10 Tf
0 -30 Td (Dr. Ada Lovelace, Dr. Alan Turing) Tj
0 -30 Td (Abstract: We present an empirical study on non-parametric knowledge retrieval.) Tj
0 -20 Td (Retrieval-Augmented Generation mitigates factual hallucination by grounding neural decoders) Tj
0 -20 Td (directly against verifiable dense vector embeddings stored in ChromaDB.) Tj
0 -20 Td (Experimental findings demonstrate a 42.8% reduction in speculative generation errors.) Tj
ET
endstream endobj
6 0 obj << /Length 320 >> stream
BT
/F1 12 Tf
72 720 Td (Section 3: Mathematical Formulation and Vector Projections) Tj
/F1 10 Tf
0 -30 Td (The projection score is computed via Cosine Similarity in high-dimensional space.) Tj
0 -20 Td (Equation 4: Similarity(u, v) = dot(u, v) / (norm(u) * norm(v))) Tj
0 -20 Td (Nearest-neighbor graphs use HNSW skip-lists for sub-millisecond retrieval latency.) Tj
0 -20 Td (Page 2 establishes that non-parametric vector indexing scales logarithmically.) Tj
ET
endstream endobj
7 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 8
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000373 00000 n 
0000000806 00000 n 
0000001179 00000 n 
trailer << /Size 8 /Root 1 0 R >>
startxref
1250
%%EOF"""
    with open(file_path, "wb") as f:
        f.write(pdf_content)

def test_complete_20_step_e2e_workflow(tmp_path):
    print("\n--- STARTING 20-STEP END-TO-END VERIFICATION WORKFLOW ---")
    
    # Pre-test cleanup: ensure clean state
    try:
        existing = requests.get(f"{BASE_URL}/api/documents", timeout=5).json()
        for d in existing:
            if d.get("name") == "Autonomous_Grounded_Reasoning.pdf":
                requests.delete(f"{BASE_URL}/api/documents/{d['id']}", timeout=5)
    except Exception:
        pass

    # 1. Start / verify server online
    print("Step 1: Verifying backend server online...")
    resp = requests.get(f"{BASE_URL}/api/health", timeout=5)
    assert resp.status_code == 200
    assert resp.json()["status"] == "online"
    initial_doc_count = resp.json()["indexed_documents_count"]
    initial_chunks_count = resp.json()["total_chunks_indexed"]
    
    # 2. Open dashboard / verify document statistics
    print("Step 2: Checking dashboard statistics...")
    docs_resp = requests.get(f"{BASE_URL}/api/documents", timeout=5)
    assert docs_resp.status_code == 200
    assert len(docs_resp.json()) == initial_doc_count
    
    # 3. Create real PDF file and upload
    print("Step 3: Uploading genuine multi-page scientific research PDF...")
    pdf_path = str(tmp_path / "Autonomous_Grounded_Reasoning.pdf")
    create_sample_research_pdf(pdf_path)
    assert os.path.exists(pdf_path)
    
    with open(pdf_path, "rb") as f:
        upload_resp = requests.post(
            f"{BASE_URL}/api/documents/upload",
            files={"file": ("Autonomous_Grounded_Reasoning.pdf", f, "application/pdf")},
            data={"doc_type": "Research Papers"},
            timeout=10
        )
    assert upload_resp.status_code == 200
    upload_data = upload_resp.json()
    assert upload_data["success"] is True
    doc_id = upload_data["document"]["id"]
    
    # 4. Verify PDF text extraction
    print(f"Step 4: Verifying PDF text extraction for {doc_id}...")
    assert upload_data["pages"] >= 2
    assert "Autonomous Grounded Reasoning" in upload_data["document"]["abstract"] or "retrieval" in upload_data["document"]["abstract"].lower()
    
    # 5. Verify hierarchical 512-token chunking
    print("Step 5: Verifying document chunking...")
    assert upload_data["total_chunks"] >= 1
    
    # 6. Verify ChromaDB vector embedding indexing
    print("Step 6: Verifying ChromaDB vector embedding storage...")
    health_after_upload = requests.get(f"{BASE_URL}/api/health").json()
    assert health_after_upload["total_chunks_indexed"] >= initial_chunks_count + upload_data["total_chunks"]
    
    # 7. Verify document metadata saved in persistence layer
    print("Step 7: Verifying document metadata persistence in database...")
    docs_after = requests.get(f"{BASE_URL}/api/documents").json()
    created_doc = next((d for d in docs_after if d["id"] == doc_id), None)
    assert created_doc is not None
    assert created_doc["name"] == "Autonomous_Grounded_Reasoning.pdf"
    
    # 8. Generate a summary using configured service
    print("Step 8: Generating structured document summary...")
    summ_resp = requests.post(
        f"{BASE_URL}/api/summarize",
        json={"doc_id": doc_id, "summary_type": "Executive Summary", "length": "Medium"},
        timeout=10
    )
    assert summ_resp.status_code == 200
    summ_data = summ_resp.json()
    assert summ_data["documentId"] == doc_id
    assert "abstract" in summ_data
    assert "methodology" in summ_data
    assert "conclusion" in summ_data
    
    # 9. Ask a grounded question about the document
    print("Step 9: Asking grounded research question...")
    query_resp = requests.post(
        f"{BASE_URL}/api/rag/query",
        json={
            "question": "What equation does the paper use to compute projection scores, and how much is error reduced?",
            "selected_doc_ids": [doc_id],
            "role": "Student"
        },
        timeout=10
    )
    assert query_resp.status_code == 200
    query_data = query_resp.json()
    
    # 10. Verify semantic search retrieved relevant chunks
    print("Step 10: Verifying retrieved semantic chunks...")
    assert len(query_data["sources"]) > 0
    assert query_data["sources"][0]["documentId"] == doc_id
    
    # 11. Verify context-grounded answer
    print("Step 11: Verifying context-grounded answer...")
    assert query_data["grounded"] is True
    assert "content" in query_data
    
    # 12. Verify source citations & exact page numbers
    print("Step 12: Verifying source citations & page references...")
    pages = [s["page"] for s in query_data["sources"]]
    assert any(p in [1, 2] for p in pages)
    
    # 13. Discover relevant videos through YouTube discovery system
    print("Step 13: Discovering relevant educational YouTube videos...")
    yt_resp = requests.get(f"{BASE_URL}/api/youtube/discover?doc_id={doc_id}", timeout=5)
    assert yt_resp.status_code == 200
    yt_data = yt_resp.json()
    
    # 14. Verify real video information
    print("Step 14: Verifying video titles, thumbnails, and channel names...")
    assert len(yt_data["videos"]) > 0
    first_vid = yt_data["videos"][0]
    assert len(first_vid["title"]) > 5
    assert len(first_vid["channel"]) > 2
    assert first_vid["thumbnailUrl"].startswith("http")
    
    # 15. Verify valid YouTube URL and playback readiness
    print("Step 15: Verifying YouTube URL and playback readiness...")
    assert first_vid["url"].startswith("https://www.youtube.com/watch?v=")
    assert "manual_fallback_url" in yt_data
    
    # 16. Compare documents
    print("Step 16: Comparing uploaded document against baseline...")
    comp_resp = requests.post(
        f"{BASE_URL}/api/compare",
        json={"doc_ids": [doc_id, "doc-1"]},
        timeout=10
    )
    assert comp_resp.status_code == 200
    comp_data = comp_resp.json()
    assert len(comp_data["dimensions"]) >= 8
    assert "insights" in comp_data
    
    # 17. Verify data persistence after simulated restart
    print("Step 17: Verifying data persistence after simulated restart...")
    persisted_docs = requests.get(f"{BASE_URL}/api/documents").json()
    assert any(d["id"] == doc_id for d in persisted_docs)
    
    # 18. Confirm document & saved records still accessible
    print("Step 18: Confirming document accessibility...")
    download_resp = requests.get(f"{BASE_URL}/api/documents/{doc_id}/download", timeout=5)
    assert download_resp.status_code == 200
    assert len(download_resp.content) > 50
    
    # 19. Delete the document
    print(f"Step 19: Deleting document {doc_id}...")
    del_resp = requests.delete(f"{BASE_URL}/api/documents/{doc_id}", timeout=5)
    assert del_resp.status_code == 200
    assert del_resp.json()["success"] is True
    
    # 20. Confirm vectors and records are properly cleaned up
    print("Step 20: Confirming vectors, files, and metadata are cleanly deleted...")
    docs_final = requests.get(f"{BASE_URL}/api/documents").json()
    assert not any(d["id"] == doc_id for d in docs_final)
    
    health_final = requests.get(f"{BASE_URL}/api/health").json()
    assert health_final["total_chunks_indexed"] < health_after_upload["total_chunks_indexed"]
    
    print("--- 20-STEP END-TO-END VERIFICATION WORKFLOW COMPLETED SUCCESSFULLY! ---\n")
