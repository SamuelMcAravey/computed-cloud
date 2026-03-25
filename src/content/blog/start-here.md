---
title: "Start Here"
description: "Why I write this, what I cover, and how to get to the useful stuff fast."
pubDate: 2026-01-13
tags: ["start-here", "meta", "systems", "architecture"]
draft: false
---

# Start Here

## TL;DR

- I write about software that has to survive real operations: integrations, payments, compliance, and long-lived enterprise systems.
- The constraint is usually the same: the happy path is easy, and the recovery path is the part that matters.
- Expect tradeoffs, failure modes, and checklists you can use without a slide deck.
- If you want beginner tutorials or hot takes, this probably is not your thing.

## Why Computed Cloud exists

I build software where correctness is not optional. Money moves, documents matter, and integrations fail in creative ways.

Most writing about architecture stops at the diagram. Reality starts when retries hit, vendors change behavior, and the workflow gets used by people who are busy and human.

This blog is where I write down what held up, what did not, and what changed because of it.

**Rule of thumb:** if you can't explain how it fails, you don't understand it yet.

## What I write about

- **Enterprise integrations:** contracts, sync strategies, credential handling, and partial failure.
- **Payments and compliance workflows:** idempotency, auditability, reconciliation, and evidence you can defend later.
- **Reliability:** incident patterns, rollback strategy, and making recovery boring.
- **Multi-tenant boundaries:** what to isolate, what to centralize, and where shared infrastructure turns into a problem.
- **Pragmatic modernization:** incremental shipping, strangler-style cutovers, and avoiding rewrite gravity.
- **Data and performance in real systems:** batch vs real-time, operational constraints, and the cost of being clever.
- **Operational tooling:** the guardrails that reduce support load, like health checks, diagnostics, migrations, and runbooks.

## What a post usually covers

Most posts follow the same shape:

- **Constraint:** what was true in the real world (scale, org limits, vendor behavior, uptime needs, compliance).
- **Decision:** what we chose and why (including what we rejected).
- **Failure mode:** how it broke (or how it almost broke) and what changed afterward.
- **Rule of thumb / checklist:** something you can apply immediately.

I want posts you can still use six months later.

## One thing I keep seeing

A clean boundary on paper can still turn into a support nightmare if it hides the failure path.

I keep treating integrations and operational workflows like product surfaces: versioned contracts, explicit states, and logs that answer questions without guesswork. This looked fine in a demo. Production disagreed.

## How to get value quickly

- Browse by **tags** and pick the one that matches the problem you are solving today.
- Search for terms like **idempotency**, **reconciliation**, **schema changes**, **cutover**, **retry/backoff**, **outbox**, **state machine**, and **multi-tenant migrations**.
- If you only read one kind of post, pick the ones labeled **patterns** or **field guides**. They usually come with a checklist.

## About me

I'm Samuel McAravey. I build integration-heavy B2B systems, usually where money, compliance, and operational reliability are part of the product.

If something here helps, or you want me to write about a specific problem, email me at `samuel@mcaravey.pro`.
