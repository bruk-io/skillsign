# Integration Tests

## Definition
Test how multiple components/modules within your codebase work together.

**Boundaries:**
- Multiple modules/components interacting
- External dependencies (DB, APIs, filesystem) are MOCKED
- Tests your architecture and component design
- Faster than E2E, slower than unit tests (seconds)

## Writing Testable Code for Integration Tests

### Define Clear Module Interfaces
```python
# ✅ Clear protocol/interface for components
from typing import Protocol

class UserRepository(Protocol):
    def save(self, user: User) -> None: ...
    def get_by_email(self, email: str) -> User | None: ...

class EmailService(Protocol):
    def send_welcome(self, email: str) -> None: ...

class UserService:
    def __init__(self, repo: UserRepository, emailer: EmailService):
        self.repo = repo
        self.emailer = emailer

    def register_user(self, email: str, name: str) -> User:
        user = User(email=email, name=name)
        self.repo.save(user)
        self.emailer.send_welcome(email)
        return user

# Integration test uses real UserService + real implementations
# but mocks external services (actual DB, actual email API)
```

### Avoid Tight Coupling
```python
# ✅ Loose coupling - components don't know about each other's internals
class OrderProcessor:
    def __init__(self, inventory: InventoryService, payments: PaymentService):
        self.inventory = inventory
        self.payments = payments

    def process(self, order: Order) -> bool:
        if not self.inventory.check_availability(order.items):
            return False
        return self.payments.charge(order.total, order.payment_method)

# ❌ Tight coupling - reaches into other module's internals
class OrderProcessor:
    def process(self, order: Order) -> bool:
        # Directly accessing DB from another module's domain
        if db.query("SELECT * FROM inventory WHERE ..."):
            payments_db.execute("INSERT INTO charges ...")
```

### Separate Concerns by Layer
```python
# ✅ Clear layers: handlers -> services -> repositories
# Handler layer
def create_user_handler(request: Request) -> Response:
    user_service.create_user(request.email, request.name)
    return Response(201)

# Service layer (business logic)
def create_user(email: str, name: str) -> User:
    user = User(email=email, name=name)
    user_repo.save(user)
    return user

# Repository layer (data access - mocked in integration tests)
def save(user: User) -> None:
    db.insert("users", user.to_dict())

# Integration test: Test handler + service together, mock repository
```

### Use Dependency Injection Throughout
```python
# ✅ Dependencies injected at composition root
class App:
    def __init__(self):
        self.user_repo = UserRepository(db)
        self.email_service = EmailService(smtp_client)
        self.user_service = UserService(self.user_repo, self.email_service)
        self.user_handler = UserHandler(self.user_service)

# For testing, inject mocks:
def test_user_registration_flow():
    mock_repo = MockUserRepository()
    mock_emailer = MockEmailService()
    service = UserService(mock_repo, mock_emailer)
    handler = UserHandler(service)

    # Test the integration between handler and service
    response = handler.create_user(Request(email="test@example.com"))
    assert response.status == 201
```

## Best Practices

- Test workflows across component boundaries
- Mock external services at the boundary (use test doubles)
- Focus on testing the "seams" between your modules
- Test error propagation across components
- Verify contracts between components are honored

## Anti-Patterns

- ❌ Testing with real databases/APIs (that's E2E)
- ❌ Testing too many components at once (unclear what broke)
- ❌ Duplicating unit test coverage
- ❌ Not testing error conditions between components
