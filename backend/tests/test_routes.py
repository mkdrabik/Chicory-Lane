import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

client = TestClient(app)

mock_env = {
    "OPENAI_API_KEY": "test-key",
    "QDRANT_API_KEY": "test-qdrant-key",
    "QDRANT_URL": "http://localhost:6333"
}


# -------------------- /upload endpoint --------------------
@patch.dict(os.environ, mock_env)
@patch("api_calls.OpenAI")
@patch("api_calls.QdrantClient")
def test_upload_txt_file(mock_qdrant, mock_openai):
    mock_openai.return_value = MagicMock()
    mock_qdrant.return_value = MagicMock()

    file_content = b"This is a test document."
    response = client.post(
        "/upload",
        files={"file": ("test.txt", file_content, "text/plain")}
    )

    assert response.status_code == 200
    assert response.json()["message"] == "File uploaded successfully"


@patch.dict(os.environ, mock_env)
@patch("api_calls.OpenAI")
@patch("api_calls.QdrantClient")
def test_upload_invalid_file_type(mock_qdrant, mock_openai):
    response = client.post(
        "/upload",
        files={"file": ("bad.pdf", b"fake pdf", "application/pdf")}
    )

    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]


# -------------------- /ask endpoint --------------------
@patch.dict(os.environ, mock_env)
@patch("api_calls.OpenAI")
@patch("api_calls.QdrantClient")
def test_ask_endpoint(mock_qdrant, mock_openai):
    mock_client = MagicMock()
    mock_client.embeddings.create.return_value.data = [MagicMock(embedding=[0.1, 0.2])]
    mock_client.chat.completions.create.return_value.choices = [
        MagicMock(message=MagicMock(content="Mocked answer from LLM"))
    ]
    mock_openai.return_value = mock_client
    mock_qdrant.return_value.search.return_value = [MagicMock(payload={"text": "Context paragraph"})]

    response = client.post(
        "/ask",
        json={"query": "What is this?", "format": "paragraph"}
    )

    assert response.status_code == 200
    assert "Mocked answer" in response.json()["answer"]


@patch.dict(os.environ, mock_env)
@patch("api_calls.OpenAI")
@patch("api_calls.QdrantClient")
def test_ask_endpoint_points_format(mock_qdrant, mock_openai):
    mock_client = MagicMock()
    mock_client.embeddings.create.return_value.data = [MagicMock(embedding=[0.1, 0.2])]
    mock_client.chat.completions.create.return_value.choices = [
        MagicMock(message=MagicMock(content="Mocked bullet points"))
    ]
    mock_openai.return_value = mock_client
    mock_qdrant.return_value.search.return_value = [MagicMock(payload={"text": "Context paragraph"})]

    response = client.post(
        "/ask",
        json={"query": "List items", "format": "points"}
    )

    assert response.status_code == 200
    assert "Mocked bullet" in response.json()["answer"]
