---
title: "Start Here"
description: "A quick orientation to what Computed Cloud covers, how I write, and where to begin."
pubDate: 2026-01-15
tags: ["start-here", "meta", "systems", "architecture"]
draft: false
---

<!--
Alternative titles:
- Start Here: Computed Cloud
- Read This First
-->

# Start Here

Computed Cloud is where I write about software that has to survive real operations: integrations, long-lived enterprise systems, and workflows where correctness matters. I started it because I like practical notes I can reuse later, and I rarely find writing that names the constraints without turning into a sales pitch. You’ll see posts about B2B SaaS, payments and compliance workflows, reliability, and pragmatic modernization. The through-line is simple: systems are judged by how they behave at the seams and under load, not by how clean the diagram looks.

## What you’ll find here

- Multi-tenant SaaS design and boundaries (what you isolate, what you centralize, and why)
- Payments and compliance workflows: idempotency, auditability, reconciliation, and failure modes
- Enterprise integrations: ERPs and back-office systems, credential patterns, and sync strategies
- Reliability and incident response: how failures show up, and how to make recovery boring
- Observability: what to log, what to measure, and what to make searchable
- Pragmatic modernization (strangler-style, incremental shipping, and risk management)
- Migrations in real systems, including multi-tenant rollouts and cutover planning
- CI/CD and release practices that reduce rollback risk and shorten feedback loops
- Data-intensive systems: performance tradeoffs, batch vs real-time, and operational constraints
- Developer productivity tooling and standards that reduce support load
- Case studies: what worked, what failed, and what I’d do differently
- Open-source writeups when the code is worth sharing

## Who this is for

- Senior engineers / architects — if you care about system boundaries, operational reality, and design choices you can defend six months later.
- Engineering leaders / founders — if you want clear tradeoffs, risk framing, and notes you can use to make decisions without a slide deck.
- People building integration-heavy, operations-heavy products — if your “happy path” is fine but the edge cases run the business.

## About me (short version)

I’m Samuel McAravey, a strategic engineering leader based in Billings, MT, with over 16 years of experience building and scaling engineering organizations and platforms. Most of my work has been in B2B SaaS, payments/compliance workflows, and data-intensive systems, where operational quality is part of the product.

I’m currently CTO/Head of Engineering at PayeWaive, where I’ve led a modular, multi-tenant B2B SaaS platform on Azure, including ERP integrations (Viewpoint Vista and Spectrum) and a geo-redundant architecture that achieved 99.99% uptime for mission-critical payment and compliance workflows. Before that, I helped modernize a 50+ person engineering organization at Nvoicepay (acquired by Corpay) while building and operating a high-volume B2B payments platform. I also co-founded Pearl Bakery and built an internal ERP/MRP system that connected orders to production planning (including bill of materials), packing, and invoicing with accounting integration and iPad-based shop-floor workflows.

## How I think about building systems

- **Reliability is a feature** — because users experience the system through outages, delays, and confusing recoveries.
- **Prefer incremental modernization over big-bang rewrites** — because risk compounds fast when production and revenue keep moving.
- **Treat integrations as products** — because most pain lives at boundaries, not in your core domain model.
- **Make failures explicit** — because money-moving and compliance workflows need clear recovery paths and evidence.
- **Design for operability** — because the best architecture still fails if on-call can’t understand it.
- **Use boring defaults when the stakes are high** — because predictability beats cleverness during incidents.
- **Optimize for the next engineer** — because handoffs are inevitable and tribal knowledge decays.
- **Keep decision records** — because “why we did this” matters as much as “what we did.”

## Post formats

### Patterns

Reusable approaches with a clear “when to use it” and “when not to” section. You’ll usually get a checklist, example pitfalls, and a concrete way to validate the pattern in production.

### Case studies

What I built (at a useful level), the constraints that shaped it, and the tradeoffs that followed. Expect at least one scar: a failure mode, the change it forced, and the new rule of thumb.

### Project notes

Open-source writeups when the code is worth sharing. These focus on how to use the thing, why it exists, and the design decisions that make it predictable.

### Field guides

Operational advice for migrations, incidents, and integrations. These are written for people who have to ship changes while staying on-call.

## Where to start

Everything here is organized by tags and the blog index. If you prefer a curated path, start with one of these:

### If you build integration-heavy products

- ERP integrations: what always goes wrong (Coming soon)
- Credential and secrets patterns (Coming soon)
- Sync strategy: snapshots vs events (Coming soon)
- Handling retries, timeouts, and partial failures (Coming soon)

### If you build money-moving workflows

- Idempotency and reconciliation (Coming soon)
- State machines that don’t explode (Coming soon)
- Audit logs that stay useful (Coming soon)
- Designing for reversals, refunds, and chargebacks (Coming soon)

### If you’re modernizing a legacy system

- Strangler pattern in practice (Coming soon)
- Safe schema changes (Coming soon)
- Operational tooling first (Coming soon)
- Migrating without breaking tenants (Coming soon)

## How posts are written here

- Posts are written in Markdown to keep the authoring surface simple.
- Code blocks are meant to be copied and run without hunting for context.
- Mermaid diagrams are used for system flows and quick architecture sketches.
- Screenshots include captions and are treated as part of the narrative, not decoration.
- When a post includes a “rule of thumb,” it’s tied to a real failure mode or constraint.
- When I’m unsure, I’ll say so and leave a clear placeholder instead of inventing certainty.
- The goal is reproducibility: concrete steps, concrete artifacts, and clear assumptions.

## One last note

If you only read a few things here, browse by tags and pick the topic you’re dealing with right now. If something is unclear or you want a specific writeup, send me a note and I’ll add it to the queue. You can reach me at `samuel@mcaravey.pro`, or find me on `linkedin.com/in/samuel-mcaravey` and `github.com/samuelmcaravey`.
