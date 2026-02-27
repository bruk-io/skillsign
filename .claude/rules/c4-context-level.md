---
globs: ["**/context.likec4", "**/context.c4", "**/views/context/**/*.likec4", "**/views/context/**/*.c4"]
---

# C4 Level 1: System Context Rules

You are editing a System Context level file. This is the highest abstraction level in C4.

## What Belongs Here
- The software system in scope (one primary system)
- People/actors who use the system (by role, not by name)
- External software systems that interact with the system in scope

## What Does NOT Belong Here
- Containers (databases, APIs, web apps) - those are Level 2
- Components (modules, services) - those are Level 3
- Technologies, protocols, or implementation details
- Infrastructure (servers, Kubernetes, cloud regions)

## Relationship Rules at This Level
- Describe WHAT the relationship does, not HOW
- Good: "Views accounts and makes payments"
- Bad: "Makes API calls using JSON/HTTPS" (too technical for Level 1)
- Every element must have at least one relationship

## Element Naming
- Name actors by role: "Customer", "Admin", "Support Agent"
- Name systems by purpose: "Online Banking System", "Email Provider"
- External systems should use `style { color muted }` to de-emphasize
