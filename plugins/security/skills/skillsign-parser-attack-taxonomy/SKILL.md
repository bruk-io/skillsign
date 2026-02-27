---
name: skillsign-parser-attack-taxonomy
description: This skill provides a taxonomy of input parsing attacks relevant to signing specifications. Use when reviewing YAML parsing security, UTF-8 encoding attacks, path traversal in identifiers, whitespace normalization, size-based DoS, or canonical form manipulation. Covers duplicate keys, anchors/aliases, tag injection, BOM manipulation, null bytes, Unicode homoglyphs, and segment injection. Do NOT use for general web security unrelated to input parsing.
---

# Parser Attack Taxonomy

## Input Surface Categories

### 1. YAML Parsing Attacks

#### Duplicate Keys
- YAML spec says duplicate keys have undefined behavior
- Parsers may keep first, last, or error
- Attack: put benign value first, malicious value second (or vice versa)
- Defense: reject duplicate keys at parse time

#### Anchors and Aliases (`&anchor`, `*alias`)
- Enable recursive/circular references (billion laughs / YAML bomb)
- Can reference unexpected nodes
- Defense: reject all anchors and aliases

#### Tags (`!!str`, `!!map`, `!!python/object`)
- Language-specific tags can trigger code execution (Python's `!!python/object`)
- Type coercion can change semantics (`!!str true` vs `true`)
- Defense: reject all YAML tags

#### Multi-Document Streams
- `---` separators create multiple documents
- Parser may only validate first document
- Trailing documents could contain override data
- Defense: reject multi-document streams

#### YAML 1.1 vs 1.2 Type Coercion
- YAML 1.1: `yes`, `no`, `on`, `off` are booleans
- YAML 1.2: these are plain strings
- Attack: exploit parser version mismatch
- Defense: mandate YAML 1.2 explicitly

#### Size-Based Attacks
- Extremely large YAML files cause OOM
- Defense: enforce maximum file size (e.g., 64KB)

### 2. UTF-8 and Encoding Attacks

#### Invalid UTF-8 Sequences
- Overlong encodings can bypass validation
- Truncated multi-byte sequences
- Defense: strict UTF-8 validation, reject invalid sequences

#### BOM Manipulation
- UTF-8 BOM (`\xEF\xBB\xBF`) at file start
- Multiple BOMs or BOMs mid-file
- Defense: strip BOM only at file start

#### Null Bytes
- Null bytes (`\x00`) can truncate strings in C-based parsers
- Can create discrepancy between what's signed and what's executed
- Defense: reject null bytes entirely

#### Unicode Homoglyphs
- Characters that look identical but have different codepoints
- `а` (Cyrillic) vs `a` (Latin)
- Defense: ASCII-only for identifiers, content signed as-is

#### Unicode Normalization Forms
- NFC, NFD, NFKC, NFKD produce different byte sequences for same visual text
- Same logical content, different digests
- Defense: document the limitation, consider mandating NFC

### 3. Path and Identifier Attacks

#### Path Traversal
- `../` segments in skill_id or file paths
- Defense: validate format (`{host}/{owner}/{name}`), reject `..` and `.`

#### Percent Encoding
- `anthropic%2Ffoo` could bypass org extraction
- Defense: percent-decode before parsing

#### Case Sensitivity Mismatches
- GitHub usernames are case-insensitive
- SkillSign treats identifiers as case-sensitive
- Attack: `Anthropic` vs `anthropic` are different skill_ids
- Defense: document, recommend lowercase

#### Segment Injection
- Extra slashes: `github.com/org//name` or `github.com/org/name/extra`
- Defense: enforce exactly 3 segments, validate each matches `[a-zA-Z0-9._-]+`

### 4. Whitespace and Line Ending Attacks

#### Mixed Line Endings
- `\r\n`, `\n`, `\r` in same file
- Different tools normalize differently
- Defense: normalize all to `\n`

#### Unicode Whitespace
- Characters like NBSP (`\u00A0`), zero-width spaces
- May or may not be stripped by normalization
- Defense: only strip ASCII space and tab, document other whitespace preserved

#### Trailing Content After Final Newline
- Content after normalization's "append single `\n`"
- Defense: strip all trailing newlines, append exactly one

### 5. Size and Resource Exhaustion

#### Large File DoS
- Extremely large SKILL.md or sidecar files
- Defense: enforce size limits on sidecar (64KB), consider limit on SKILL.md

#### Algorithmic Complexity
- Crafted inputs that trigger worst-case regex/parsing behavior
- Defense: use simple, bounded parsing rules

## Review Checklist

When reviewing a spec's input handling:
1. Are all input formats explicitly defined with rejection behavior?
2. Are size limits specified for all parseable inputs?
3. Is encoding validated before parsing?
4. Are dangerous YAML features (anchors, tags, multi-doc) rejected?
5. Are identifiers restricted to safe character sets?
6. Is path traversal prevented in all identifier fields?
7. Are case sensitivity rules explicit and consistent?
8. Is null byte handling specified for all string fields?
9. Are Unicode normalization implications documented?
10. Is the YAML version mandated (1.2)?
