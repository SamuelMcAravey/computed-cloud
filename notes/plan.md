Here's a solid "first wave" set that gets **computedcloud.com** looking real fast, without boxing you into dated content. It's organized into buckets so you can publish 10-25 posts quickly and still feel coherent.

## Bucket 0: Site foundation (2-3 posts)

These set context and act like your "personal website" content.

1. **Start Here**

* What Computed Cloud is
* What you build (enterprise systems, payments/compliance, integrations, modernization)
* What readers can expect (practical, implementation-first)

2. **How I Build Software That Survives Reality**

* Your principles: correctness, operational reliability, pragmatic modernization
* "No big-bang rewrites," "type safety first," "tradeoffs in business terms"

3. **My Tooling Stack for Writing Technical Posts**

* Astro + markdown + code/mermaid/image conventions
* A short guide for readers ("how to read this blog")

## Bucket 1: "Platform primitives" series (8-15 posts)

This is your main content engine. Each primitive becomes a repeatable format.

Template for each post:

* Problem → API/design → examples → tradeoffs → what I'd change.

Suggested sequence:

1. **Configuration as a first-class system** (typed config, validation, environments)
2. **Secrets and credential boundaries** (where secrets live, rotation, least privilege)
3. **Multi-tenant context** (tenant/org context patterns, caching, request lifecycle)
4. **Background jobs** (idempotency, retries, poison handling, observability)
5. **Eventing patterns** (in-process vs queue, contracts, versioning)
6. **Database migrations** (DBUp/Flyway style, forward-only, multi-tenant rollouts)
7. **Logging and traces that you actually use** (structured logs, correlation IDs)
8. **Feature flags without chaos** (flag design, kill switches, auditability)
9. **File/blob storage** (naming, immutability, lifecycle, signing URLs)
10. **Email as an integration** (templates, deliverability basics, retries, tracking)
11. **Error handling philosophy** (domain errors vs exceptions, user-safe messages)
12. **API boundaries and DTOs** (don't leak internals; versioning strategy)

You can absolutely go granular here. The trick is: **each post should end with an artifact** (a code snippet, a pattern, a checklist). That keeps it from turning into "thoughts" posts.

## Bucket 2: "Systems I've built" case studies (5-8 posts)

These are the bigger, portfolio-grade narratives.

1. **Building a Custom ERP/MRP From Scratch**

* BOM, production plans, packing, invoicing, QuickBooks integration, shop-floor reality

2. **Integrating with ERPs without hating your life**

* credential patterns, schema differences, rate limits, sync strategy

3. **Payments workflows: reliability, audit, and "don't lose money" engineering**

* idempotency, reconciliation, status models, operational tooling

4. **Compliance workflows in B2B software**

* why compliance features become product features (and support cost reducers)

5. **Modernizing a 50+ person engineering org (what actually worked)**

* CI/CD, release discipline, cultural change mechanisms

## Bucket 3: Practical "how-to" posts (6-12 posts)

These bring in search traffic and show hands-on competence, without being generic.

Pick topics you can write in 60-90 minutes:

* "Mermaid diagrams that don't become spaghetti"
* "Designing idempotent APIs (with examples)"
* "Schema changes in multi-tenant systems: safe rollout checklist"
* "Retry policies that won't DDoS your own dependencies"
* "Incident response notes for small teams"
* "Strangler pattern in practice: carving a legacy module out safely"
* "How to model statuses without creating a 200-state enum"
* "A simple approach to audit logs that doesn't kill performance"

## Bucket 4: Business/ops posts (optional, but valuable) (3-6 posts)

These can include the bakery, but keep them **engineering-adjacent** so the blog stays coherent.

Good angles:

* **"What running a manufacturing business taught me about software requirements"**
* **"Why 'ops' people hate your UI (and how to fix it)"**
* **"Designing for non-technical users: constraints are features"**
* **"Inventory/production planning reality vs software fantasy"**

Avoid pure memoir. Make it about systems, process, and decision-making.

## Bucket 5: Small tools section (optional)

Astro can host small interactive pages, but I'd keep this lightweight at first:

* A `/tools` section with 2-3 tiny utilities you actually use

  * Example: JSON formatter with "copy"
  * Mermaid previewer
  * "Diff view" helper
    But do this after you've published 10+ posts so it doesn't distract from content momentum.

---

# Recommended publishing order (fast + coherent)

If you want the site to look "real" quickly, publish in this order:

1. Start Here
2. How I Build Software That Survives Reality
3. Building a Custom ERP/MRP From Scratch
4. Multi-tenant context pattern
5. DB migrations: forward-only + multi-tenant rollouts
6. Idempotency in payments workflows
7. Logging/correlation IDs that you actually use
8. Feature flags + kill switches
9. Integrating with ERPs: the hard parts
10. Background jobs: retries, poison messages, observability
    11-20) Platform primitives (pick the ones you've already implemented)
    21+) "How-to" posts for search

---

# How granular should you go?

Use this rule:

* If the primitive has a **reusable pattern** (API, interface, checklist) → **its own post**.
* If it's mostly "implementation details" without a reusable lesson → **bundle it** into a larger post.

A good target for early posts:

* **800-1,500 words**
* **1 diagram OR 2-3 code blocks**
* **1 concrete takeaway** (pattern/checklist/snippet)
