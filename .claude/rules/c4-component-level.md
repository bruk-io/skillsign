---
globs: ["**/components/**/*.likec4", "**/components/**/*.c4", "**/views/components/**/*.likec4", "**/views/components/**/*.c4"]
---

# C4 Level 3: Component Rules

You are editing a Component level file. This level shows the internal structure of a single container.

## What Is a Component
- A grouping of related functionality behind a well-defined interface
- Examples: auth module, payment processor, order repository, API controller layer

## What Is NOT a Component
- A single class or function (too granular)
- An implementation detail (internal helper, utility)
- A deployment unit (that's a container)

## What Belongs Here
- Components within a single container
- Relationships between components
- External containers that interact with this container's components

## When to Create Component Diagrams
- The container has non-obvious internal structure
- Multiple teams or developers work on this container
- The container has been a source of confusion
- Planning a significant refactoring

## When NOT to Create Component Diagrams
- The container follows a well-known pattern (simple MVC, CRUD API)
- Only one person works on it
- The code itself is the best documentation
- The internals change every sprint

## Relationship Rules at This Level
- Technology details are optional (internal method calls don't need protocol labels)
- Focus on purpose: "Validates tokens", "Routes requests", "Manages sessions"
- Include technology only for cross-container relationships

## Element Count
- Aim for 5-10 components per container
- More than 15 components means the container itself may need to be split
- Every component must have at least one relationship
