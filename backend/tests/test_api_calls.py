# backend/tests/test_api_calls.py
import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from unittest.mock import patch, MagicMock
from api_calls import add_document, search_with_context

# Mock environment variables so the code doesn't crash
mock_env = {
    "OPENAI_API_KEY": "test-key",
    "QDRANT_API_KEY": "test-qdrant-key",
    "QDRANT_URL": "http://localhost:6333"
}

@patch.dict(os.environ, mock_env)
@patch("api_calls.OpenAI")
@patch("api_calls.QdrantClient")
def test_add_document_splits_and_upserts(mock_qdrant, mock_openai):
    # Setup mocks
    mock_client = MagicMock()
    # Each chunk returns a fake embedding
    mock_client.embeddings.create.return_value.data = [MagicMock(embedding=[0.1, 0.2])]
    mock_openai.return_value = mock_client
    mock_qdrant.return_value = MagicMock()

    # Call function
    add_document("Paragraph one.\n\nParagraph two.")

    # Assertions
    assert mock_client.embeddings.create.call_count == 2, "Should create embedding for each paragraph"
    assert mock_qdrant.return_value.upsert.called, "Should call Qdrant upsert"

@patch.dict(os.environ, mock_env)
@patch("api_calls.OpenAI")
@patch("api_calls.QdrantClient")
def test_search_with_context_returns_string(mock_qdrant, mock_openai):
    # Setup mocks
    mock_client = MagicMock()
    mock_client.embeddings.create.return_value.data = [MagicMock(embedding=[0.1, 0.2])]
    mock_client.chat.completions.create.return_value.choices = [
        MagicMock(message=MagicMock(content="This is a test answer."))
    ]
    mock_openai.return_value = mock_client
    mock_qdrant.return_value.search.return_value = [
        MagicMock(payload={"text": "Context paragraph"})
    ]

    # Call function
    result = search_with_context("What is context?", "paragraph")

    # Assertions
    assert isinstance(result, str), "Result should be a string"
    assert "test answer" in result.lower(), "Result should contain the mocked answer"
