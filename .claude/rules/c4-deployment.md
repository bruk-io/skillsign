---
globs: ["**/deployment/**/*.likec4", "**/deployment/**/*.c4", "**/views/deployment/**/*.likec4", "**/views/deployment/**/*.c4"]
---

# C4 Deployment Model Rules

You are editing a deployment model or deployment view file. Deployment describes how logical containers map to physical infrastructure.

## Deployment Node Hierarchy
- Environment (production, staging, dev)
  - Region/Zone (us-east, eu-west)
    - Infrastructure (Kubernetes cluster, VM, serverless)
      - Instances of containers

## Key Rules
- Use `instanceOf` to deploy logical model containers to physical nodes
- Instances inherit properties from their source container
- Override title/technology on instances for environment-specific details
- Deployment-specific relationships (replication, failover) are defined here, not in the logical model
- Use `style { multiple true }` for horizontally scaled instances

## What Belongs Here
- Physical topology: environments, regions, clusters, VMs
- How containers are deployed (which containers run where)
- Deployment-specific relationships (replication, failover, load balancing)

## What Does NOT Belong Here
- Logical architecture (that's the model)
- Business relationships between systems (that's context level)
- Component internals
