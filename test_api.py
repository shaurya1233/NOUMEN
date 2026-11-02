"""
============================================================
SHAURYA MITTAL | DEVELOPER PROFILE API
File: test_api.py
Purpose: Automated API testing
Framework: pytest + Flask
============================================================
"""

import pytest

from app import app


# ============================================================
# 1. TEST CONFIGURATION
# ============================================================

@pytest.fixture
def client():
    """Create a Flask test client."""

    app.config["TESTING"] = True

    with app.test_client() as test_client:
        yield test_client


# ============================================================
# 2. HEALTH CHECK
# ============================================================

def test_health_endpoint(client):
    """Check whether the API health endpoint responds."""

    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.is_json


# ============================================================
# 3. PROFILE ENDPOINT
# ============================================================

def test_profile_endpoint(client):
    """Check the profile endpoint."""

    response = client.get("/api/profile")

    assert response.status_code == 200
    assert response.is_json


# ============================================================
# 4. PROJECTS ENDPOINT
# ============================================================

def test_projects_endpoint(client):
    """Check the projects endpoint."""

    response = client.get("/api/projects")

    assert response.status_code == 200
    assert response.is_json


# ============================================================
# 5. INTERESTS ENDPOINT
# ============================================================

def test_interests_endpoint(client):
    """Check the interests endpoint."""

    response = client.get("/api/interests")

    assert response.status_code == 200
    assert response.is_json


# ============================================================
# 6. SOCIAL LINKS ENDPOINT
# ============================================================

def test_social_links_endpoint(client):
    """Check the social links endpoint."""

    response = client.get("/api/social-links")

    assert response.status_code == 200
    assert response.is_json


# ============================================================
# 7. SEARCH ENDPOINT
# ============================================================

def test_search_endpoint(client):
    """Check whether the search endpoint accepts a query."""

    response = client.get("/api/search?q=developer")

    assert response.status_code == 200
    assert response.is_json


# ============================================================
# 8. INVALID ROUTE
# ============================================================

def test_invalid_route(client):
    """Check that an unknown route returns HTTP 404."""

    response = client.get("/api/route-that-does-not-exist")

    assert response.status_code == 404


# ============================================================
# 9. RESPONSE FORMAT
# ============================================================

def test_profile_returns_json(client):
    """Ensure profile responses use JSON content."""

    response = client.get("/api/profile")

    assert response.content_type.startswith("application/json")


# ============================================================
# 10. API SECURITY HEADERS
# ============================================================

def test_security_headers(client):
    """Check commonly used security response headers."""

    response = client.get("/api/health")

    assert "X-Content-Type-Options" in response.headers
    assert "X-Frame-Options" in response.headers


# ============================================================
# END OF TEST SUITE
# ============================================================
