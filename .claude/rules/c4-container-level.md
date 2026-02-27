---
globs: ["**/container.likec4", "**/container.c4", "**/containers/**/*.likec4", "**/containers/**/*.c4"]
---

# C4 Level 2: Container Rules

You are editing a Container level file. This level shows the high-level technology decisions and deployment structure within a system.

## What Is a Container
- A separately runnable/deployable unit
- Something that executes code or stores data
- Examples: web app, API server, database, message queue, mobile app, serverless function

## What Is NOT a Container
- A Docker container (though it may run in one)
- A class, module, or package (those are components)
- A logical grouping (use views/groups for that)

## What Belongs Here
- All containers within the software system boundary
- Relationships between containers (with technology details)
- People and external systems that interact with these containers

## Relationship Rules at This Level
- Include the technology/protocol in relationship labels
- Good: "Makes API calls using JSON/HTTPS"
- Good: "Reads from and writes to using JDBC"
- Good: "Publishes order events using Kafka"
- Bad: "Uses" (too vague)
- Bad: "Connects to" (says nothing)

## Technology Annotations
- Every container SHOULD have a `technology` property
- Use `icon tech:<name>` for visual clarity
- Use appropriate shapes: `storage` for databases, `queue` for message queues, `browser` for web apps, `mobile` for mobile apps

## Decomposition Check
- If a container has complex internals, create a `components/` subdirectory
- If a container is simple (e.g., a database), no further decomposition is needed
- Aim for 5-15 containers per system. More than 15 suggests the system should be split.
