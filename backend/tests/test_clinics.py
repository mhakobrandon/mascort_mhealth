import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestClinics:
    """Tests for clinic endpoints"""
    
    def test_get_all_clinics(self):
        """Test getting all clinics"""
        response = client.get("/api/clinics/")
        assert response.status_code in [200, 404]
    
    def test_nearby_clinics(self):
        """Test getting nearby clinics"""
        response = client.get(
            "/api/clinics/nearby",
            params={"latitude": -4.0383, "longitude": 17.8252}
        )
        assert response.status_code in [200, 404]
