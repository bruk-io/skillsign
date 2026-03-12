BUILD_DIR := _build
VERSION ?= main

.PHONY: build build-site build-docs build-architecture clean deploy

build: clean build-site build-docs build-architecture
	@mkdir -p $(BUILD_DIR)/docs $(BUILD_DIR)/architecture
	@cp -r site/_build/* $(BUILD_DIR)/
	@cp -r docs/_build/* $(BUILD_DIR)/docs/
	@cp -r architecture/_build/* $(BUILD_DIR)/architecture/
	@echo "All assets built to $(BUILD_DIR)/"

build-site:
	@$(MAKE) -C site build

build-docs:
	@$(MAKE) -C docs build

build-architecture:
	@$(MAKE) -C architecture build

clean:
	@$(MAKE) -C site clean
	@$(MAKE) -C docs clean
	@$(MAKE) -C architecture clean
	@rm -rf $(BUILD_DIR)

# Deploy versioned build to gh-pages branch.
#
# Usage:
#   make deploy                   # deploys to /main/
#   make deploy VERSION=v0.1.0   # deploys to /v0.1.0/ and updates /latest/
deploy: build
	@./scripts/deploy-pages "$(VERSION)" "$(BUILD_DIR)"
