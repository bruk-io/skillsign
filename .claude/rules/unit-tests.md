# Unit Tests

## Definition
Test a single function/module in complete isolation.

**Boundaries:**
- All external dependencies mocked/stubbed
- No I/O: no network, no file system, no database, no environment variables
- Speed: milliseconds per test
- Scope: one function/class, testing logic and edge cases

## Writing Testable Code for Unit Tests

### Prefer Pure Functions
```python
# ✅ Easy to unit test
def calculate_discount(price: float, percentage: float) -> float:
    return price * (percentage / 100)

# ❌ Hard to unit test - has side effects
def apply_discount(order_id: str) -> None:
    order = db.get_order(order_id)  # DB dependency
    discount = calculate_discount(order.price, 10)
    db.update_order(order_id, discount)  # Side effect
```

### Use Dependency Injection
```python
# ✅ Dependencies passed in, easy to mock
def process_user(user_data: dict, emailer: EmailService) -> User:
    user = User(**user_data)
    emailer.send_welcome(user.email)
    return user

# ❌ Hard to test - global/implicit dependency
def process_user(user_data: dict) -> User:
    user = User(**user_data)
    send_email(user.email)  # Where does this come from?
    return user
```

### Avoid Global State
```python
# ✅ State passed explicitly
def add_item(cart: list[Item], item: Item) -> list[Item]:
    return cart + [item]

# ❌ Global state makes tests interfere with each other
CART = []
def add_item(item: Item) -> None:
    CART.append(item)  # Mutates global
```

### Keep Functions Small and Focused
```python
# ✅ Small, testable pieces
def validate_email(email: str) -> bool:
    return "@" in email and "." in email.split("@")[1]

def create_user(email: str, name: str) -> User | None:
    if not validate_email(email):
        return None
    return User(email=email, name=name)

# ❌ Too much in one function
def create_user(email: str, name: str) -> User | None:
    # Email validation mixed with user creation
    if not ("@" in email and "." in email.split("@")[1]):
        return None
    user = User(email=email, name=name)
    return user
```

## Best Practices

- Test behavior, not implementation details
- One assertion per test (when possible)
- Use descriptive test names: `test_calculate_discount_with_zero_percentage_returns_zero`
- Test edge cases: empty inputs, null, zero, negative numbers, boundary values
- Don't test framework code - test YOUR logic

## Anti-Patterns

- ❌ Testing private methods directly
- ❌ Brittle tests that break when refactoring
- ❌ Tests that require specific execution order
- ❌ Using real datetime/random - mock these
