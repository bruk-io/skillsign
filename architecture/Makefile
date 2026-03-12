BUILD_DIR ?= _build

.PHONY: build clean validate

build: validate
	@npx likec4 build -o $(BUILD_DIR)
	@echo "architecture: built to $(BUILD_DIR)/"

validate:
	@npx likec4 validate

clean:
	@rm -rf $(BUILD_DIR)
