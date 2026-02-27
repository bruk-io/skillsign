# Python Standalone Scripts

## When to Use
For single-file tools and utilities that don't need a full project structure.

## PEP 723 - Inline Script Metadata

Use UV's support for inline script dependencies (similar to npx for Node.js):

```python
#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.13"
# dependencies = [
#   "requests",
#   "click",
#   "rich",
# ]
# ///

import click
import requests
from rich import print

@click.command()
@click.argument("url")
def main(url: str) -> None:
    """Fetch and display URL content."""
    response = requests.get(url)
    print(f"[bold green]Status:[/bold green] {response.status_code}")
    print(response.text[:500])

if __name__ == "__main__":
    main()
```

**Run as a binary:**
```bash
chmod +x fetch-url
./fetch-url https://example.com
```

UV (via shebang) automatically:
- Creates isolated environment
- Installs dependencies
- Runs the script

**Note:** No .py extension - treat scripts as executables/binaries.

## Best Practices

### Always Include Shebang and Metadata Block
```python
# ✅ Always include shebang and specify Python version and dependencies
#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.13"
# dependencies = [
#   "requests>=2.31.0",
# ]
# ///

# ❌ Don't skip the shebang or metadata block
import requests  # Where does this come from? How to run this?
```

### Use Type Hints
```python
# ✅ Type hints make scripts maintainable
def process_data(items: list[dict[str, str]]) -> list[str]:
    return [item["name"] for item in items]

# ❌ Avoid untyped scripts
def process_data(items):
    return [item["name"] for item in items]
```

### Include Docstrings
```python
# ✅ Document what the script does
#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.13"
# dependencies = ["click", "requests"]
# ///

"""
Fetch data from API and save to file.
"""

import click
import requests

@click.command()
@click.option("--url", required=True, help="API URL to fetch from")
@click.option("--output", required=True, help="Output file path")
def main(url: str, output: str) -> None:
    """Fetch data from API and save to file."""
    # Implementation here
    pass

# ❌ Don't leave scripts undocumented
```

### Treat Scripts as Binaries
```python
#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.13"
# dependencies = ["requests", "click"]
# ///

"""Fetch URL content."""

import click
import requests

@click.command()
@click.argument("url")
def main(url: str) -> None:
    """Fetch and print URL content."""
    response = requests.get(url)
    click.echo(response.text)

if __name__ == "__main__":
    main()
```

Save as `fetch-content` (no .py extension), then:
```bash
chmod +x fetch-content
./fetch-content https://example.com
```

## When NOT to Use

Create a proper UV project instead when:
- Multiple files needed
- Complex dependencies or dev dependencies
- Need tests alongside the code
- Building a package for distribution
- Team will collaborate on it

For those cases: `uv init project-name`
