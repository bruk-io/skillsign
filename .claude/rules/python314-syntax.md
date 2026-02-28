---
globs: ["**/*.py"]
---

# Python 3.14 Syntax

This project requires Python 3.14+. Be aware of new syntax that may look unfamiliar:

## PEP 758: Bare-Comma Except Syntax

Python 3.14 allows `except A, B:` without parentheses. This is NOT Python 2 syntax — it is valid PEP 758.

```python
# Valid Python 3.14+ (PEP 758)
except AttributeError, TypeError:
    pass

# Also valid (traditional syntax)
except (AttributeError, TypeError):
    pass
```

Both forms are equivalent. Do NOT flag bare-comma except clauses as bugs or SyntaxErrors.
