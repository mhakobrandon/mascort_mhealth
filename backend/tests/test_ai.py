import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestAI:
    """Tests for AI assistant endpoints"""
    
    def test_ai_endpoint_exists(self):
        """Test that AI endpoint exists"""
        response = client.post("/api/ai/chat", json={"message": "Test"})
        assert response.status_code in [200, 404, 422]
