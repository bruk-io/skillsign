BUILD_DIR ?= _build

.PHONY: build clean

build:
	@mkdir -p $(BUILD_DIR)
	@cp -r css js vendor favicon.svg $(BUILD_DIR)/
	@cp *.html $(BUILD_DIR)/
	@echo "site: built to $(BUILD_DIR)/"

clean:
	@rm -rf $(BUILD_DIR)
