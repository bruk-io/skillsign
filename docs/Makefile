BUILD_DIR ?= _build

.PHONY: build clean serve

build:
	@uv run mkdocs build --config-file ../mkdocs.yml --site-dir /tmp/skillsign-docs-build
	@rm -rf $(BUILD_DIR)
	@mv /tmp/skillsign-docs-build $(BUILD_DIR)
	@echo "docs: built to $(BUILD_DIR)/"

serve:
	@uv run mkdocs serve --config-file ../mkdocs.yml

clean:
	@rm -rf $(BUILD_DIR)
