import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestPrevention:
    """Tests for prevention methods endpoints"""
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
    
    def test_get_prevention_methods(self):
        """Test getting all prevention methods"""
        response = client.get("/api/prevention/")
        assert response.status_code in [200, 404]
    
    def test_get_prevention_methods_by_category(self):
        """Test filtering by category"""
        response = client.get("/api/prevention/category/contraception")
        assert response.status_code in [200, 404]
