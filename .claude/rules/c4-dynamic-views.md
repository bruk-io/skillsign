---
globs: ["**/dynamic/**/*.likec4", "**/dynamic/**/*.c4", "**/views/dynamic/**/*.likec4", "**/views/dynamic/**/*.c4"]
---

# C4 Dynamic View Rules

You are editing a dynamic view file. Dynamic views describe runtime behavior: use cases, workflows, and interaction sequences.

## Purpose
- Show how elements interact at runtime for a specific scenario
- Tell a story with ordered steps
- Complement static structural diagrams with behavioral context

## Key Rules
- Each dynamic view should represent ONE scenario or use case
- Steps should be ordered chronologically
- Use `parallel { }` for concurrent operations
- Use `notes` for additional context on complex steps
- Use `navigateTo` to link to related views for drill-down

## Naming
- Name views after the scenario: `checkoutFlow`, `userRegistration`, `passwordReset`
- Title should describe the use case: "Checkout Flow", "User Registration Process"

## Step Quality
- Every step needs a clear, specific label
- Good: "POST /orders with cart items"
- Bad: "Sends request"
- Use `<-` for responses: `webApp <- api 'Returns order confirmation'`

## When to Create Dynamic Views
- Critical user journeys (checkout, registration, authentication)
- Complex multi-service interactions
- Async workflows involving event buses
- Scenarios that stakeholders need to understand
