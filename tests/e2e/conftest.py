"""E2E test configuration — applies pytest.mark.e2e and skips unless SKILLSIGN_E2E=1."""

import os

import pytest

pytestmark = pytest.mark.e2e


def pytest_collection_modifyitems(
    config: pytest.Config, items: list[pytest.Item]
) -> None:
    if not os.getenv("SKILLSIGN_E2E"):
        skip = pytest.mark.skip(reason="Set SKILLSIGN_E2E=1 to run e2e tests")
        for item in items:
            if "e2e" in item.keywords:
                item.add_marker(skip)
