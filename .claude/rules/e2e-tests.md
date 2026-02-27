# End-to-End (E2E) / Post-Deployment Tests

## Definition
Test the entire deployed system through its public interface with real external dependencies.

**Boundaries:**
- Real deployed environment (staging/production)
- Real external dependencies: actual DB, actual APIs, actual file system
- Entry point: through actual API endpoints, UI, or CLI - not internal functions
- Slowest tests (minutes), run less frequently

## Purpose
E2E tests validate that:
- The deployed service can reach external dependencies
- Configuration is correct (connection strings, credentials)
- Network/infrastructure is properly wired
- The complete system works as users experience it

## Writing Testable Code for E2E Tests

### Design Clear Public APIs
```python
# ✅ Well-defined public interface for E2E testing
@app.post("/api/users")
def create_user(email: str, name: str) -> dict:
    """Public API endpoint - entry point for E2E tests"""
    user = user_service.create_user(email, name)
    return {"id": user.id, "email": user.email}

# E2E test hits this actual endpoint:
# POST http://staging.example.com/api/users
```

### Make Operations Idempotent Where Possible
```python
# ✅ Idempotent - safe to retry in tests
@app.put("/api/users/{user_id}/profile")
def update_profile(user_id: str, profile: Profile) -> dict:
    """Update replaces entire profile - same result if called twice"""
    return user_service.update_profile(user_id, profile)

# ❌ Non-idempotent - hard to test reliably
@app.post("/api/users/{user_id}/credits")
def add_credits(user_id: str, amount: int) -> dict:
    """Each call adds more credits - retries cause problems"""
    return user_service.add_credits(user_id, amount)
```

### Design for Test Data Management
```python
# ✅ Support test data cleanup
@app.delete("/api/test/users/{user_id}")
def delete_test_user(user_id: str, test_mode: bool = False) -> None:
    """Allow cleanup in test environments"""
    if not test_mode and not is_test_environment():
        raise Forbidden("Test endpoint only available in test mode")
    user_service.delete_user(user_id)

# ✅ Use unique identifiers for test data
def test_user_registration():
    test_email = f"test+{uuid4()}@example.com"  # Unique per test run
    response = requests.post("/api/users", json={
        "email": test_email,
        "name": "Test User"
    })
    # Cleanup after test
    requests.delete(f"/api/test/users/{response.json()['id']}", params={"test_mode": True})
```

### Support Test Environment Configuration
```python
# ✅ Environment-aware configuration
class Config:
    def __init__(self):
        self.env = os.getenv("ENVIRONMENT", "production")
        self.db_url = os.getenv("DATABASE_URL")
        self.enable_test_endpoints = self.env in ["test", "staging"]

    def is_test_environment(self) -> bool:
        return self.env == "test"

# E2E tests run against staging/test environments
```

### Health Checks and Readiness Probes
```python
# ✅ Expose health endpoint for E2E validation
@app.get("/health")
def health_check() -> dict:
    """Verify all dependencies are reachable"""
    return {
        "status": "healthy",
        "database": check_database_connection(),
        "redis": check_redis_connection(),
        "external_api": check_external_api_connection()
    }

# E2E test can verify deployment before running tests
def setup_e2e_tests():
    response = requests.get("http://staging.example.com/health")
    assert response.json()["status"] == "healthy"
```

## Best Practices

- Test critical user journeys end-to-end
- Use unique test data (UUIDs, timestamps) to avoid conflicts
- Clean up test data after tests run
- Run against staging/test environments, not production
- Focus on happy paths and critical error scenarios
- Verify infrastructure/deployment, not business logic details
- Keep E2E tests focused - don't test every edge case here

## Test Structure

```python
# Example E2E test structure
def test_complete_user_registration_flow():
    # Setup: Ensure environment is ready
    base_url = "https://staging.example.com"
    test_email = f"test+{uuid4()}@example.com"

    # Test: Full user journey
    # 1. Register user
    response = requests.post(f"{base_url}/api/users", json={
        "email": test_email,
        "name": "Test User"
    })
    assert response.status_code == 201
    user_id = response.json()["id"]

    # 2. Verify user can login
    login_response = requests.post(f"{base_url}/api/login", json={
        "email": test_email,
        "password": "test123"
    })
    assert login_response.status_code == 200
    token = login_response.json()["token"]

    # 3. Verify user can access protected resource
    profile_response = requests.get(
        f"{base_url}/api/users/{user_id}/profile",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert profile_response.status_code == 200

    # Cleanup: Remove test data
    requests.delete(
        f"{base_url}/api/test/users/{user_id}",
        params={"test_mode": True}
    )
```

## Anti-Patterns

- ❌ Testing business logic details (that's unit/integration)
- ❌ Running against production
- ❌ Not cleaning up test data
- ❌ Testing through internal APIs/functions instead of public interface
- ❌ Too many E2E tests (slow and expensive)
- ❌ Flaky tests that fail intermittently due to timing
