---
globs: ["**/specification.likec4", "**/specification.c4"]
---

# C4 Specification Rules

You are editing a specification file. This defines the element kinds, relationship kinds, tags, and colors used across the entire architecture model.

## Element Kind Guidelines
- Define element kinds that map to C4 abstractions: actor, system, container, component
- Add specialized kinds for common patterns: database, queue, mobile, browser
- Set default styles on kinds to ensure visual consistency
- Use `shape person` for actors, `shape storage` for databases, `shape queue` for message queues

## Relationship Kind Guidelines
- Define semantic relationship types: async, subscribes, replicates
- Only create relationship kinds for patterns that recur across the model
- Set default line styles: dashed for async, dotted for subscriptions

## Tag Guidelines
- Tags are for cross-cutting concerns: deprecated, next, internal, external
- Keep tags minimal. If you have more than 10 tags, some are probably element kinds instead.
- Set colors on tags for visual consistency in views

## Color Guidelines
- Use custom colors sparingly. Theme colors (primary, secondary, muted, etc.) cover most cases.
- Define custom colors for brand-specific needs or to distinguish specific domains
