from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_crowd_dynamics_routing():
    response = client.post(
        "/api/v1/stadium/dispatch",
        json={
            "user_type": "fan",
            "language": "es",
            "location_context": "Gate 4, North Stand",
            "query_or_incident": "There is a massive bottleneck at the ticket turnstiles and nobody is moving.",
            "accessibility_needs": []
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "routing_instructions" in data