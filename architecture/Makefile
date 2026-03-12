BUILD_DIR ?= _build
BASE_URL ?= /

.PHONY: build clean validate

build: validate
	@npx likec4 build -o $(BUILD_DIR) --base "$(BASE_URL)"
	@echo "architecture: built to $(BUILD_DIR)/ (base: $(BASE_URL))"

validate:
	@npx likec4 validate

clean:
	@rm -rf $(BUILD_DIR)
