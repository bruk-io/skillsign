---
globs: ["**/*.likec4", "**/*.c4"]
---

# C4 Relationship Rules (All Levels)

These rules apply to relationships at every level of the C4 model.

## Every Relationship MUST Have a Label
- No unlabeled arrows. Every `->` needs a description.
- The label answers: "What does this connection do?"

## Label Quality by Level

**Level 1 (Context):** Describe what, not how.
- "Views accounts and makes payments"
- "Sends notification emails to"

**Level 2 (Container):** Include technology/protocol.
- "Makes API calls using JSON/HTTPS"
- "Reads from and writes to using JDBC"
- "Publishes order events using Kafka"

**Level 3 (Component):** Focus on purpose.
- "Validates authentication tokens"
- "Routes order requests to"
- "Transforms and persists"

## Anti-Patterns
- "Uses" - uses what? how?
- "Connects to" - everything connects
- "Interacts with" - how?
- "Calls" - calls what?
- "Data" - what data? which direction?
- Bidirectional arrows - split into two directed relationships

## Direction
- Arrow points from dependent to dependency
- Follow data flow or control flow direction
- When both read and write exist, combine if same path: "Reads from and writes to using SQL"
- Split into separate relationships if paths differ or distinction matters
