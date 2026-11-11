import os
import sys
import pytest

# Add backend directory to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from server import (
    clean_text,
    chunk_text,
    extract_key_concepts,
    parse_iso8601_duration,
    secure_doc_filename,
    collection,
    CHROMA_AVAILABLE
)

def test_clean_text_normalization():
    raw_text = "This is a  line with\r\nwindows line endings and a hyphen-\nated word.   Extra spaces here."
    cleaned = clean_text(raw_text)
    assert "\r" not in cleaned
    assert "hyphenated" in cleaned
    assert "  " not in cleaned

def test_clean_text_empty():
    assert clean_text("") == ""
    assert clean_text(None) == ""

def test_chunk_text_sliding_window():
    # 600 words text
    sample_words = [f"word{i}" for i in range(600)]
    sample_text = " ".join(sample_words)
    chunks = chunk_text(sample_text, page_number=1, doc_id="test-doc", chunk_size=512, overlap=50)
    
    # Should produce 2 chunks with overlap
    assert len(chunks) == 2
    assert chunks[0]["page"] == 1
    assert chunks[0]["doc_id"] == "test-doc"
    assert chunks[0]["id"] == "test-doc-p1-c0"
    assert chunks[1]["id"] == "test-doc-p1-c1"
    assert chunks[0]["word_count"] == 512
    # Verify overlap: last words of chunk 0 appear in chunk 1
    assert "word510" in chunks[0]["text"]
    assert "word510" in chunks[1]["text"]

def test_chunk_text_empty():
    assert chunk_text("", 1, "doc-1") == []

def test_extract_key_concepts():
    scientific_text = """
    We propose a novel Transformer Architecture relying on Self-Attention and Cosine Similarity in a high-dimensional Embedding Space.
    Empirical evaluation of Retrieval-Augmented Generation demonstrates significant reduction in hallucination metrics.
    Deep Learning models require robust parameter optimization.
    """
    concepts = extract_key_concepts(scientific_text, max_concepts=5)
    assert len(concepts) > 0
    # Common stopwords should be filtered out
    for c in concepts:
        assert c.lower() not in ["the", "we", "in", "and", "a", "of"]
    # Check that multi-word concepts or capitalized terms are captured
    matched_any = any("attention" in c.lower() or "transformer" in c.lower() or "retrieval" in c.lower() or "embedding" in c.lower() for c in concepts)
    assert matched_any is True

def test_parse_iso8601_duration():
    assert parse_iso8601_duration("PT15M33S") == "15:33"
    assert parse_iso8601_duration("PT1H2M3S") == "1:02:03"
    assert parse_iso8601_duration("PT45S") == "0:45"
    assert parse_iso8601_duration("PT10M") == "10:00"
    assert parse_iso8601_duration("invalid") == "invalid"
    assert parse_iso8601_duration("") == "12:00"

def test_secure_doc_filename():
    assert secure_doc_filename("../../etc/passwd.pdf") == "passwd.pdf"
    assert secure_doc_filename("..\\..\\windows\\system32.pdf") == "system32.pdf"
    assert secure_doc_filename("normal_paper.pdf") == "normal_paper.pdf"
    assert secure_doc_filename("Paper with Spaces (2024).pdf") == "Paper with Spaces (2024).pdf"
    assert secure_doc_filename("") == "document.pdf"

@pytest.mark.skipif(not CHROMA_AVAILABLE, reason="ChromaDB not available")
def test_chromadb_collection_operations():
    assert collection is not None
    initial_count = collection.count()
    test_id = "test-unit-chunk-001"
    
    # 1. Add vector
    collection.add(
        ids=[test_id],
        documents=["Scaled Dot-Product attention computes scores as softmax(QK^T / sqrt(d_k))V."],
        metadatas=[{"doc_id": "test-unit-doc", "page": 1, "doc_name": "UnitTest.pdf"}]
    )
    assert collection.count() == initial_count + 1
    
    # 2. Query vector
    results = collection.query(
        query_texts=["What is the formula for scaled dot-product attention?"],
        n_results=1,
        where={"doc_id": "test-unit-doc"}
    )
    assert len(results["documents"][0]) == 1
    assert "softmax" in results["documents"][0][0]
    
    # 3. Clean up
    collection.delete(ids=[test_id])
    assert collection.count() == initial_count
